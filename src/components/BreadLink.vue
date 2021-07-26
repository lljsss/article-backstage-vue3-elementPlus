<template>
  <!-- 面包屑导航 -->
  <div class="nav">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ menuName }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: ["menuName"],
};
</script>

<style lang="scss" scoped>
.nav {
  width: 100%;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}
</style>