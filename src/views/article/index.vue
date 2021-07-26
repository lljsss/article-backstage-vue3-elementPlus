<template>
  <div class="box">
    <!-- 筛选卡片 -->
    <el-card class="card">
      <!-- 面包屑导航 -->
      <BreadLink menuName="文章管理" />
      <!-- 筛选表单 -->
      <el-form ref="formRef" :model="form" label-width="60px" size="mini">
        <el-form-item label="状态：">
          <el-radio-group v-model="form.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道：">
          <el-select v-model="form.channelId" placeholder="请选择">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              :label="channel.name"
              :value="channel.id"
              :key="channel.id"
              v-for="channel in channels"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            v-model="form.rangDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleSubmit"
            :disabled="loading"
            :loading="loading"
            >筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选结果 -->
    <el-card class="tab-card" style="margin-top: 30px">
      <div class="tab-title">
        <span>根据筛选条件共查询到{{ total }}条消息</span>
      </div>
      <!-- 表格 -->
      <el-table :data="articles" style="width: 100%" stripe border size="small">
        <el-table-column label="封面">
          <template #default="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover.images[0]"
              fit="cover"
              lazy
            >
              <template #placeholder>
                <div class="image-slot">加载中<span class="dot">...</span></div>
              </template>
              <template #error>
                <div class="image-slot">
                  <img src="./no-cover.png" alt="" style="width:100px"/>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column>
          <template #default="scope">
            <el-tag :type="articleStatus[scope.row.status].type">
              {{ articleStatus[scope.row.status].text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="$router.push('/publish?id=' + scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="handleDeleteArt(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 10px"
        :disabled="loading"
        :page-size="per_page"
        :page-sizes="[10, 20, 30, 50]"
        layout="total,sizes, prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="page"
      >
      </el-pagination>
    </el-card>
    
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { getArticles, getChannels, deleteArt } from "../../api/article";
import { ElMessageBox, ElMessage } from "element-plus";
import BreadLink from "../../components/BreadLink.vue";
export default {
  components: { BreadLink },
  setup() {
    //表格总数
    let total = ref(0);
    let loading = ref(false);
    //文章列表
    let articles = ref([]);
    //频道列表
    let channels = ref([]);
    //文章状态
    const articleStatus = reactive([
      { status: 0, text: "草稿", type: "info" },
      { status: 1, text: "待审核", type: "parimary" },
      { status: 2, text: "审核通过", type: "success" },
      { status: 3, text: "审核失败", type: "warning" },
      { status: 4, text: "已删除", type: "danger" },
    ]);
    //表格筛选参数
    let form = reactive({
      status: null,
      channelId: null,
      rangDate: [],
    });
    //分页请求参数
    let reqParams = {
      page: 1,
      per_page: 10,
    };
    //获取频道列表
    const loaclChannels = async () => {
      const res = await getChannels();
      channels.value = res.data.channels;
    };
    loaclChannels();
    //获取文章列表
    const localArticle = async (page = 1) => {
      loading.value = true;
      const res = await getArticles({ ...reqParams, page });
      console.log(res);
      articles.value = res.data.results;
      total.value = res.data.total_count;
      loading.value = false;
    };
    localArticle();
    //筛选提交
    const handleSubmit = () => {
      reqParams.status = form.status!==null? form.status : null;
      reqParams.channel_id = form.channelId ? form.channelId : null;
      reqParams.begin_pubdate = form.rangDate ? form.rangDate[0] : null;
      reqParams.end_pubdate = form.rangDate ? form.rangDate[1] : null;
      localArticle();
    };
    //页码改变
    const handleCurrentChange = (page) => {
      reqParams.page = page;
      localArticle(page);
    };
    //条数改变
    const handleSizeChange = (prePage) => {
      reqParams.per_page = prePage;
      localArticle();
    };
    //删除文章
    const handleDeleteArt = (id) => {
      ElMessageBox.confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteArt(id.toString()).then((res) => {
            localArticle(reqParams.page);
          });
          ElMessage({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          console.log(2);
          ElMessage({
            type: "info",
            message: "已取消",
          });
        });
    };
    return {
      form,
      articleStatus,
      loading,
      articles,
      channels,
      total,
      handleSubmit,
      handleCurrentChange,
      handleSizeChange,
      handleDeleteArt,
    };
  },
};
</script>

<style lang="scss" scoped>
.box {
  .tab-card {
    .tab-title {
      border-bottom: 1px solid #ebeef5;
      padding-bottom: 20px;
      margin-bottom: 26px;
    }
  }
}
</style>