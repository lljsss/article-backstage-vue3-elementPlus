<template>
  <el-menu
    :default-active="currentPath"
    class="nav-menu"
    background-color="#011f34"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    :collapse="isCollapse"
  >
  <h2 :style="!isCollapse ? 'display:block' : 'display:none'">管理菜单</h2>
    <el-menu-item index="/">
      <i class="iconfont iconhome"></i>
      <span>数据展示</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="iconfont iconarticle"></i>
      <span>内容管理</span>
    </el-menu-item>
    <el-menu-item index="/images">
      <i class="iconfont iconl-img"></i>
      <span>素材管理</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="iconfont iconpublish"></i>
      <span>发布文章</span>
    </el-menu-item>
    <el-menu-item index="/comment">
      <i class="iconfont iconpinglun"></i>
      <span>评论管理</span>
    </el-menu-item>
    <el-menu-item index="/fans">
      <i class="iconfont iconfensi"></i>
      <span>粉丝管理</span>
    </el-menu-item>
    <el-menu-item index="/settings">
      <i class="el-icon-setting"></i>
      <span>个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { useRoute } from 'vue-router'
import {ref} from 'vue'

export default {
  props:['isCollapse'],
  setup(){
    const route=useRoute()
    const currentPath=ref(route.path)
    return{currentPath}
  }
}
</script>

<style lang="scss" scoped>
.nav-menu{
  .el-menu-item{
    padding: 0 26px !important;
    text-align: center;
  }
}
h2{
  text-align: center;
  color: #fff;
}
.iconfont {
    margin-right: 10px;
    // padding-left: 5px;
  }
  // span{
  //    margin-right: 12px;
  // }
</style>