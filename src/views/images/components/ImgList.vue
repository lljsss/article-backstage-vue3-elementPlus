<template>
  <div class="img-list">
    <!-- 头部切换按钮 -->
    <div class="header-button">
      <el-radio-group
        @change="handleChangeRadio"
        v-model="collect"
        size="medium"
      >
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <el-button
        @click="() => (dialogVisible = true)"
        type="success"
        size="mini"
        >上传文件</el-button
      >
    </div>
    <!-- 素材列表 -->
    <el-row :gutter="20">
      <el-col
        style="position: relative"
        @click="()=>selected = index"
        v-for="(item, index) in imgList"
        :key="item.id"
        :xs="12"
        :md="6"
        :sm="6"
        :lg="4"
      >
        <el-image style="height: 100px;width:100%;" :src="item.url" fit="cover">
          <template #error>
            <div class="image-slot">
              <img src="../../../assets/images/no-cover.png" alt="" 
              style="width:100%;height: 100px"/>
            </div>
          </template>
        </el-image>
        <!-- 被选中图片的样式 -->
        <div class="selected" v-if="isShowSelected && selected == index"></div>
        <!-- 收藏和删除的按钮 -->
        <div class="image-button" v-if="isShowButton">
          <el-button
            :loading="item.loading"
            type="primary"
            :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
            circle
            size="mini"
            @click="handleCollect(item)"
          />
          <el-button
            :loading="item.loading"
            size="mini"
            @click="handleDelete(item)"
            type="danger"
            icon="el-icon-delete-solid"
            circle
          />
        </div>
      </el-col>
    </el-row>
    <el-pagination
      style="margin-top: 20px; display: flex; justify-content: flex-end"
      :current-page="page"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-sizes="[6, 12, 24, 36]"
      :page-size="6"
      layout="total, sizes, prev, pager, next, jumper"
      :total="imgTotal"
    />
    <el-dialog title="上传素材" v-model="dialogVisible">
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        multiple
        name="image"
        :auto-upload="false"
        :headers="uploadheaders"
        :file-list="fileList"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">
            只能上传 jpg/png 文件，且不超过 500kb
          </div>
        </template>
      </el-upload>
      <template #footer>
        <el-button type="primary" @click="handleUploadSubmit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getImage, collectImg, deleteImg } from "../../../api/images";
import { reactive, ref, toRef } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
export default {
  props: {
    //是否显示收藏删除按钮
    isShowButton: { type: Boolean, default: true },
    //是否显示被选中图片
    isShowSelected: { type: Boolean, default: false },
  },
  setup() {
    //被选中index
    let selected=ref(null)
    //上传文件列表
    let fileList = ref([]);
    //uploadRef
    const uploadRef = ref(null);
    //用户信息
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    //选择上传文件请求头
    const uploadheaders = reactive({
      Authorization: `Bearer ${userInfo.token}`,
    });
    //控制显示对话框参数
    let dialogVisible = ref(false);
    //是否显示收藏图片
    let collect = ref(false);
    //素材列表
    const imgList = ref([]);
    //总条数
    const imgTotal = ref(0);
    //请求参数
    let reqParams = {
      page: 1,
      per_page: 6,
      collect: false,
    };
    //选中页码
    const page = toRef(reqParams, "page");
    //获取图片列表
    const getImgList = async () => {
      const res = await getImage({ ...reqParams });
      res.data.results.forEach((i) => {
        i.loading = false;
      });
      imgList.value = res.data.results;
      imgTotal.value = res.data.total_count;
    };
    getImgList();
    //切换全部和收藏显示
    const handleChangeRadio = (value) => {
      reqParams.page = 1;
      reqParams.collect = value;
      getImgList();
    };
    //页码改变
    const handleCurrentChange = (page) => {
      reqParams.page = page;
      getImgList();
    };
    //条数改变
    const handleSizeChange = (size) => {
      reqParams.per_page = size;
      getImgList();
    };
    //图片收藏
    const handleCollect = async (img) => {
      img.loading = true;
      const res = await collectImg(img.id, !img.is_collected);
      if (res.message == "OK") {
        img.is_collected = !img.is_collected;
        img.loading = false;
      }
    };
    //上传文件
    const handleUploadSubmit = () => {
      uploadRef.value.submit();
      fileList.value = [];
      reqParams.page = 1;
      getImgList();
      dialogVisible.value = false;
    };
    //图片删除
    const handleDelete = async (img) => {
      ElMessageBox.confirm("是否删除此图片？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          img.loading = true;
          const res = await deleteImg(img.id);
          getImgList();
          img.loading = false;
          ElMessage({
            type: "success",
            message: "删除图片成功!",
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消",
          });
        });
    };
    return {
      selected,
      fileList,
      uploadRef,
      uploadheaders,
      dialogVisible,
      page,
      collect,
      imgList,
      imgTotal,
      handleUploadSubmit,
      handleSizeChange,
      handleCurrentChange,
      handleCollect,
      handleDelete,
      handleChangeRadio,

    };
  },
};
</script>

<style lang="scss" scoped>
.header-button {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.image-button {
  height: 30px;
  width: calc(100% - 20px);
  background-color: rgba(204, 204, 204, 0.5);
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  bottom: 4px;
  left: 10px;
  // margin: 0 10px;
}
.selected {
  position: absolute;
  top: 0;
  background: url("./selected.png") no-repeat;
  background-color: rgba(0, 0, 0, 0.6);
  background-size: cover;
  width: 109px;
  height: 100px;
}
</style>