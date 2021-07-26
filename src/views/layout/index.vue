<template>
  <el-container class="container">
    <el-aside width="auto" class="aside">
      <AppAside :isCollapse="isCollapse" class="aside-menu"></AppAside>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="head-right">
          <i
            @click="showCollapse"
            :class="{
              'el-icon-s-unfold': isCollapse,
              'el-icon-s-fold': !isCollapse,
            }"
          ></i>
          <span>文章内容发布系统</span>
        </div>
        <div class="head-right">
          <img :src="$store.state.user.photo" alt="" />
          <span>{{ $store.state.user.name }}</span>
          <el-dropdown>
            <i class="el-icon-arrow-down el-icon--right"></i>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人设置</el-dropdown-item>
                <el-dropdown-item @click="loginOut">
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { ref } from "vue";
import AppAside from "./aside";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { useStore } from "vuex";
export default {
  components: { AppAside },
  setup() {
    const store = useStore();
    const router = useRouter();
    //显示下拉菜单
    let isCollapse = ref(false);
    const showCollapse = () => {
      isCollapse.value = !isCollapse.value;
    };
    //退出登录
    const loginOut = () => {
      ElMessageBox.confirm("是否退出登录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(1);
          ElMessage({
            type: "success",
            message: "退出成功!",
          });
          window.localStorage.removeItem("userInfo");
          router.push("/login");
        })
        .catch(() => {
          console.log(2);
          ElMessage({
            type: "info",
            message: "已取消",
          });
        });
    };
    //获取用户信息
    store.dispatch("getUser");
    return {  isCollapse, showCollapse, loginOut };
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  .aside {
    overflow: auto;
    background-color: #011f34;
    // height: 100vh;
    .aside-menu {
      height: 100%;
    }
    h2 {
      color: #fff;
      text-align: center;
      margin-bottom: 10px;
    }
  }
  .header {
    // position: fixed;
    // top: 0;
    // right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    .head-left {
      line-height: 60px;
      i {
        font-size: 17px;
      }
      span {
        font-size: 17px;
      }
    }
    .head-right {
      display: flex;
      align-items: center;
      height: 100%;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      span {
        margin: 0 10px;
      }
    }
  }
  .main {
    background-color: #fff;
  }
}
</style>