<template>
  <div class="comment-container">
    <el-card class="box-card">
      <!-- 面包屑导航 -->
      <BreadLink menuName="评论管理" />
      <el-table
        :data="comments"
        style="width: 100%"
        stripe
        border
        lazy
      >
        <el-table-column prop="title" label="标题" width="180">
        </el-table-column>
        <el-table-column
          prop="total_comment_count"
          label="总评论数"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数">
        </el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            {{ scope.row.comment_status ? "正常" : "关闭" }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-switch
              :disabled="scope.row.statusDisabled"
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleChangeSwitch(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        background
        style="margin-top: 20px; display: flex; justify-content: flex-end"
        :current-page="page"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 15, 30, 50]"
        :page-size="per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalComment"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import BreadLink from "../../components/BreadLink.vue";
import { ElMessage } from "element-plus";
import { getArticles, updataCommentStatus } from "../../api/article";
import {ref} from 'vue'
export default {
  components: { BreadLink },
  setup() {
    //评论列表
    let comments = ref([]);
    //总条数
    let totalComment = ref(0);
    //请求参数
    let reqParams = { page: 1, per_page: 10, response_type: "comment" };
    //获取评论列表
    const getArticleList = async () => {
      const res = await getArticles(reqParams);
      if (res.message == "OK") {
        res.data.results.forEach((i) => {
          i.statusDisabled = false;
        });
        comments.value = res.data.results;
        totalComment.value = res.data.total_count;
      }
    };
    getArticleList();
    //页码改变
    const handleCurrentChange = (page) => {
      reqParams.page = page;
      getArticleList();
    };
    //条数改变
    const handleSizeChange = (size) => {
      reqParams.per_page = size;
      getArticleList();
    };
    //改变文章评论状态
    const handleChangeSwitch = async (article) => {
      article.statusDisabled = true;
      // console.log(article.comment_status)
      const res = await updataCommentStatus(
        article.id.toString(),
        article.comment_status
      );
      console.log(res);
      article.statusDisabled = false;
      ElMessage.success(
        article.comment_status ? "开启文章评论状态" : "关闭文章评论状态"
      );
    };
    return {
      comments,
      totalComment,
      handleCurrentChange,
      handleSizeChange,
      handleChangeSwitch,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>