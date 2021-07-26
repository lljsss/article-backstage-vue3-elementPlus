<template>
  <div class="fans-container">
    <el-card class="box-card">
      <!-- 面包屑导航 -->
      <BreadLink menuName="粉丝管理" />
      <el-row>
        <el-col
          :key="fans.id.toString()"
          v-for="fans in fansList"
          class="fansStyle"
          :span="2"
        >
          <div class="demo-basic--circle">
            <el-avatar
              :size="70"
              :src="fans.photo"
              @error="errorHandler"
            ></el-avatar>
          </div>
          <!-- <div class="demo-type">
            <el-avatar :size="70" :src="fans.photo" @error="errorHandler">
              <img
                src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1605975993492&di=fc5d1c1d11165a24ee5c2558e3c79969&imgtype=0&src=http%3A%2F%2Fbbs.itheima.com%2Fdata%2Fattachment%2Fforum%2F201509%2F25%2F234548r7riy8y778zslslw.gif"
              />
            </el-avatar>
          </div> -->
          <!-- <img class="imgBox" :src="fans.photo" alt="" /> -->
          <p>{{ fans.name }}</p>
          <el-tag class="tag" size="small">+关注</el-tag>
        </el-col>
      </el-row>
      <!-- 分页器 -->
      <el-pagination
        background
        style="margin-top: 20px; display: flex; justify-content: flex-end"
        :current-page="page"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-size="12"
        page-sizes="[24,36,48]"
        layout="total, prev, pager, next, jumper"
        :total="totalFans"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import BreadLink from "../../components/BreadLink.vue";
import { getFans } from "../../api/fans";
import { ref } from "vue";
export default {
  components: { BreadLink },
  setup() {
    //粉丝列表
    let fansList = ref([]);
    //总条数
    let totalFans = ref(0);
    //分页请求参数
    let reqParams = { page: 1, per_page: 24 };
    //获取粉丝列表
    const getFansList = async () => {
      const res = await getFans(reqParams);
      if (res.message == "OK") {
        fansList.value = res.data.results;
        totalFans.value = res.data.total_count;
      }
    };
    getFansList();
    //页码改变
    const handleCurrentChange = (page) => {
      reqParams.page = page;
      getFansList();
    };
    //条数改变
    const handleSizeChange = (size) => {
      reqParams.per_page = size;
      getFansList();
    };
    return { fansList, totalFans, handleSizeChange, handleCurrentChange };
  },
};
</script>

<style lang="scss" scoped>
.fansStyle {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 180px;
  border: 1px solid #ccc;
  margin-right: 50px;
  margin-bottom: 20px;
  .tag {
    cursor: pointer;
  }
  p {
    font-size: 14px;
  }
}
</style>