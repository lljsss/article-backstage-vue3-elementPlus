<template>
  <div class="box">
    <el-card class="card">
      <!-- 面包屑导航 -->
      <BreadLink :menuName="id ? '修改文章' : '发布文章'" />
      <el-form ref="formRef" :model="article" label-width="80px" :rules="rules">
        <el-form-item label="标题：" prop="title">
          <el-input
            placeholder="请输入标题"
            style="width: 400px"
            v-model="article.title"
          />
        </el-form-item>
        <el-form-item
          label="内容："
          prop="content"
          style="height: 400px; min-width: 750px"
          id="editor"
        >
          <QuillEditor
            :modules="modules"
            ref="editorRef"
            @ready="ready"
            toolbar="full"
            contentType="html"
            v-model:content="article.content"
          />
        </el-form-item>
        <el-form-item label="封面：" id="cover">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <div style="display: flex">
            <template v-if="article.cover.type > 0">
              <UploadCover
                style="margin-right: 15px"
                :key="cover"
                v-for="(cover, index) in article.cover.type"
                @getCoverImgs="getCoverImgs($event, index)"
                :imgSrc="article.cover.images[index]"
              />
            </template>
          </div>
        </el-form-item>
        <el-form-item label="频道：" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              :key="channel.id"
              v-for="channel in channels"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit(false)">{{
            id ? "修改" : "发表"
          }}</el-button>
          <el-button @click="handleSubmit(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import imageUploader from "quill-image-uploader";
import { reactive, ref, toRef } from "vue";
import { publishArt, updateArt, getChannels, getArt } from "../../api/article";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import BreadLink from "../../components/BreadLink.vue";
import { uploadImage } from "../../api/images";
import UploadCover from "./components/UploadCover.vue";
export default {
  components: {
    QuillEditor,
    BreadLink,
    UploadCover,
  },
  setup() {
    //富文本编辑器模块
    const modules = reactive({
      name: "imageUploader",
      module: imageUploader,
      options: {
        upload: (file) => {
          const fd = new FormData();
          fd.append("image", file);
          // 第一个return 是返回promise对象
          // 第二个return是 返回结果
          return uploadImage(fd).then((res) => {
            return res.data.url;
          });
        },
      },
    });
    const route = useRoute();
    const router = useRouter();
    //频道列表
    let channels = ref([]);
    const formRef = ref(null);
    const editorRef = ref(null);
    //编辑文章id
    let id = ref(route.query.id);
    //原先封面类型
    let type = null;
    //文章提交表单
    let article = ref({
      title: "",
      content: "",
      cover: { type: 0, images: [] },
      channel_id: null,
    });
    //表单校验规则
    const rules = reactive({
      title: [
        { required: true, message: "请输入标题名称", trigger: "blur" },
        { min: 5, max: 30, message: "长度在 5 到 30 个字符", trigger: "blur" },
      ],
      content: [
        { required: true, message: "文章内容不能为空", trigger: "blur" },
        // 自定义校验 富文本编辑器清空后 会 余留p 标签
        {
          validator(rule, value, callback) {
            if (value === "<p></p>") {
              callback(new Error("文章内容不能为空"));
            } else {
              callback();
            }
          },
        },
      ],
      channel_id: [{ required: true, message: "请选择文章频道" }],
    });
    //子组件向父组件传值
    const getCoverImgs = (url, index) => {
      console.log(url, index);
      article.value.cover.images[index] = url;
    };
    //获取某个文章内容
    const getOneArticle = async () => {
      const res = await getArt(id.value);
      if (res.message === "OK") {
        article.value = res.data;
        type = res.data.cover.type;
        console.log(article);
      }
    };
    //富文本编辑器初始化
    const ready = () => {
      if (id.value) {
        getArt(id.value).then((res) => {
          console.log(res.data.content);
          editorRef.value.setHTML(res.data.content);
        });
      }
    };
    //获取编辑文章内容
    if (id.value) {
      getOneArticle();
    }
    //获取频道
    const loaclChannels = async () => {
      const res = await getChannels();
      channels.value = res.data.channels;
    };
    loaclChannels();
    //修改或提交文章
    const handleSubmit = (draft = false) => {
      console.log(draft);
      //表单验证
      formRef.value.validate(async (valid, err) => {
        if (!valid) return;
        //封面类型切换
        if (id.value) {
          let updataImages = article.value.cover.images;
          let updataType = article.value.cover.type;
          if (type !== updataType) {
            if (type == 3 && updataType == 0) {
              updataImages.splice(0);
            }
            if (type == 3 && updataType == 1) {
              updataImages.splice(1, 2);
            }
            if (type == 1 && updataType == 0) {
              updataImages.splice(0);
            }
          }
          //修改文章
          const res = await updateArt(id.value, article.value, draft);
          if (res.message === "OK") {
            ElMessage.success(`${draft ? "存入草稿" : "修改文章"}成功~`);
            router.push("/article");
          }
        } else {
          //新建文章
          const res = await publishArt(article.value, draft);
          if (res.message == "OK") {
            ElMessage.success(`${draft ? "存入草稿" : "发布文章"}成功~`);
            router.push("/article");
          }
        }
      });
    };

    return {
      modules,
      editorRef,
      formRef,
      article,
      rules,
      channels,
      id,
      handleSubmit,
      getCoverImgs,
      ready,
    };
  },
};
</script>

<style lang="scss" scoped>
@media screen and (min-width: 1536px) {
  #cover {
    margin-top: 70px;
  }
}
@media screen and (max-width: 1535px) {
  #cover {
    margin-top: 120px;
  }
}
.box {
  .card {
    #editor {
      // background: #000 !important;
      .ql-container.ql-snow {
        background: #000 !important;
      }
    }
  }
}
</style>