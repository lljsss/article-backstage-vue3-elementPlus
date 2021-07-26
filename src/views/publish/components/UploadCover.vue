<template>
  <div class="box" @click="() => (dialogVisible = true)">
    <div class="cover-box">
      <img :src="imgSrc" class="cover-img" ref="imgRef" fit="cover" />
    </div>
    <el-dialog title="选择封面" v-model="dialogVisible" append-to-body>
      <!-- tab栏切换 -->
      <el-tabs v-model="tabsSwitch" type="card">
        <el-tab-pane label="素材库" name="first">
          <ImgList
            :isShowSelected="true"
            :isShowButton="false"
            ref="imgListRef"
          />
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input ref="inputRef" type="file" @change="handleChooseFile" />
          <img :src="pUrl" alt="" />
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button type="primary" @click="handleCoverConfirm">提交</el-button>
        <el-button @click="() => (dialogVisible = false)">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref } from "vue";
import { uploadImage } from "../../../api/images";
import ImgList from "../../images/components/ImgList";
import { ElMessage } from "element-plus";
export default {
  props:['imgSrc'],
  components: { ImgList },
  setup(props, context) {
    //对话框显示隐藏
    let dialogVisible = ref(false);
    //tabs切换
    let tabsSwitch = ref("first");
    let inputRef = ref(null);
    let imgListRef = ref(null);
    let imgRef=ref(null)
    //提交图片路径
    let pUrl = ref("");
    const handleChooseFile = () => {
      const file = inputRef.value.files[0];
      pUrl.value = window.URL.createObjectURL(file);
    };
    //封面提交
    const handleCoverConfirm = async () => {
      const file = inputRef.value.files[0];
      //本地图片上传
      if (tabsSwitch.value === "second") {
        if (!file) {
          ElMessage.info("请选择上传的图片");
          return;
        }
        const fd = new FormData();
        fd.append("image", file);
        const res = await uploadImage(fd);
        if (res.message === "OK") {
          // 在封面展示此图
          imgRef.value.src = res.data.url;
          // 将图片地址 传给父组件
          context.emit("getCoverImgs", res.data.url);
          // 关闭对话框
          dialogVisible.value = false;
        }
        //素材库图片选择
      } else if (tabsSwitch.value === "first") {
        const selected = imgListRef.value.selected;
        if (selected === null) {
          ElMessage.info("请选择上传的图片");
          return;
        }
        imgRef.value.src = imgListRef.value.imgList[selected].url;
        context.emit("getCoverImgs", imgListRef.value.imgList[selected].url);
        dialogVisible.value = false;
      }
    };
    return {
      imgRef,
      pUrl,
      imgListRef,
      inputRef,
      tabsSwitch,
      dialogVisible,
      handleCoverConfirm,
      handleChooseFile,
    };
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 100px;
  height: 120px;
  border: 1px solid #ccc;
  .cover-img {
    height: 120px;
    max-width: 100%;
  }
}
</style>