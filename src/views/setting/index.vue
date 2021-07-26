<template>
  <div class="setting-container">
    <el-card class="box-card">
      <!-- 面包屑导航 -->
      <BreadLink menuName="个人设置" />
      <el-row>
        <el-col :span="12">
          <el-form
            ref="formRef"
            :model="user"
            label-width="100px"
            :rules="rules"
          >
            <el-form-item label="编号："> {{ user.id }} </el-form-item>
            <el-form-item label="手机："> {{ user.mobile }} </el-form-item>
            <el-form-item prop="name" label="媒体名称：">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item prop="intro" label="媒体介绍：">
              <el-input v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item prop="email" label="邮箱：">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="setBtnLoading"
                type="primary"
                @click="handleSubmit"
                >提交</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <el-col style="text-align: center" :offset="3" :span="5">
          <el-avatar
            shape="square"
            :size="200"
            fit="cover"
            :src="user.photo"
            @click="() => inputRef.click()"
          ></el-avatar>
          <p>修改头像</p>
          <input ref="inputRef" hidden type="file" @change="handleChooseFile" />
        </el-col>
      </el-row>
    </el-card>

    <!-- 修改头像的 对话框 -->
    <el-dialog
      title="修改头像"
      v-model="dialogAvatar"
      @opened="ondialogOpened"
      @closed="onDialogClosed"
    >
      <div class="perview-img-wrap">
        <img ref="imgRef" class="perview-img" :src="perviewImg" alt="" />
      </div>
      <template #footer>
        <el-button @click="() => (dialogAvatar = false)">取 消</el-button>
        <el-button
          type="primary"
          @click="handleUpdatePhoto"
          :loading="avaLoading"
          >确 定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>


<script>
import BreadLink from "../../components/BreadLink.vue";
import { getUserProfile, updataUserAvatar, updataUser } from "../../api/user";
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  components: { BreadLink },
  setup() {
    const router = useRouter();
    const store = useStore();
    //用户信息
    const user = ref({});
    const inputRef = ref(null);
    //对话显示隐藏
    let dialogAvatar = ref(false);
    //选择图片路径
    let perviewImg = ref("");
    let imgRef = ref(null);
    //图片裁切对象
    let cropper = null;
    //裁切图片确定按钮loading
    let avaLoading = ref(false);
    //个人信息提交按钮loading
    let setBtnLoading = ref(false);
    //表单校验规则
    const rules = reactive({
      name: [
        { required: true, message: "请输入媒体名称", trigger: "change" },
        { min: 1, max: 7, message: "长度在 1 到 7 个字符", trigger: "change" },
      ],
      intro: [{ required: true, message: "请输入媒体描述", trigger: "change" }],
      email: [
        { required: true, message: "请输入邮箱", trigger: "change" },
        {
          pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          message: "邮箱格式有误",
          trigger: "change",
        },
      ],
    });
    //获取用户信息
    getUserProfile().then(res=>{
      user.value=res.data
    })
    //修改用户资料
    const handleSubmit = async () => {
      setBtnLoading.value = true;
      const res = await updataUser(user.value);
      if (res.message == "OK") {
        store.dispatch('getUser')
        setBtnLoading.value = false;
        ElMessage.success("修改用户资料成功~");
      }
    };
    //选择文件
    const handleChooseFile = () => {
      console.log(inputRef.value.files);
      // 直接拿到 可以给图片设置 src
      const blobData = window.URL.createObjectURL(inputRef.value.files[0]);
      console.log(blobData);
      perviewImg.value = blobData;
      // 解决选择相同文件 不触发的问题
      // inputRef.value = ''
      dialogAvatar.value = true;
    };
    //对话框已经打开回调
    const ondialogOpened = () => {
      //创建图片裁切对象
      cropper = new Cropper(imgRef.value, {
        aspectRatio: 1, // 初始化比例
        viewMode: 1, // 禁止裁切框 移出 图片范围
        dragMode: "none", // 禁止移动画布
        cropBoxResizable: false, // 禁止改变裁切框 的大小
      });
    };
    //对话框关闭回调
    const onDialogClosed = () => {
      cropper.destroy();
    };
    //提交裁切后的图片
    const handleUpdatePhoto = () => {
      avaLoading.value = true;
      console.log(cropper);
      cropper.getCroppedCanvas().toBlob((file) => {
        const fd = new FormData();
        fd.append("photo", file);
        updataUserAvatar(fd).then((res) => {
          store.dispatch('getUser')
          user.value.photo = window.URL.createObjectURL(file);
          dialogAvatar.value = false;
          avaLoading.value = false;
        });
      });
    };

    return {
      avaLoading,
      imgRef,
      setBtnLoading,
      perviewImg,
      dialogAvatar,
      inputRef,
      user,
      rules,
      handleSubmit,
      handleChooseFile,
      ondialogOpened,
      onDialogClosed,
      handleUpdatePhoto,
    };
  },
};
</script>

<style lang="scss" scoped>
.perview-img-wrap {
  .perview-img {
    display: block;

    /* This rule is very important, please don't ignore this */
    max-width: 100%;
    height: 300px;
  }
}
</style>