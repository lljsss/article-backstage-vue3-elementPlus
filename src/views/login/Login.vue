<template>
  <div class="box">
    <el-form
      :model="user"
      status-icon
      :rules="rules"
      ref="loginFormRef"
      class="login-form"
    >
      <h2>后台管理系统登录</h2>
      <el-form-item label="手机号" prop="mobile">
        <el-input
          type="text"
          v-model="user.mobile"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="code">
        <el-input
          type="text"
          v-model="user.code"
          placeholder="请输入验证码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="agree" style="margin-left: 0">
        <el-checkbox v-model="user.agree">
          我已阅读并同意用户协议和隐私条款
        </el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { login } from "../../api/user";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    //loginFormRef
    const loginFormRef = ref(null);
    let user = reactive({
      mobile: "13911111111",
      code: "246810",
      agree: true,
    });
    //表单验证规则
    const rules = reactive({
      mobile: [
        { required: true, message: "手机号不能为空", trigger: "blur" },
        {
          pattern: /^1[3|4|5|7|8|9]\d{9}$/,
          message: "手机号不正确",
          trigger: "change",
        },
      ],
      code: [
        { required: true, message: "验证码不能为空", trigger: "blur" },
        {
          pattern: /^\d{6}$/,
          message: "验证码错误",
          trigger: "change",
        },
      ],
      agree: [
        {
          validator: (rule, value, callback) => {
            if (value) {
              callback();
            } else {
              callback(new Error("请勾选用户协议"));
            }
          },
          trigger: "change",
        },
      ],
    });
    //登录
    const loginFun = async () => {
      const res = await login(user);
      if (res.message === "OK") {
        const userInfo = (await res).data;
        window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
        ElMessage.success("登录成功");
        router.push("/");
      } else {
        ElMessage.error("登录失败！");
      }
    };
    //登录按钮提交
    const handleLogin = () => {
      loginFormRef.value.validate((vaild, err) => {
        if (!vaild) {
          return;
        }
        loginFun();
      });
    };
    //重置按钮
    const handleReset = () => {
      user.mobile = "";
      user.code = "";
    };
    return { user, rules, handleLogin, handleReset, loginFormRef };
  },
};
</script>

<style lang="scss" scoped>
.box {
  position: fixed;
  flex-direction: column;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("./login_bg.jpg");
  background-size: cover;

  .login-form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    h2 {
      text-align: center;
    }
    position: relative;
    background-color: #fff;
    padding: 20px 50px 20px 50px;
    min-width: 350px;
    .login-btn {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0;
      // flex-direction: column;
    }
  }
  .el-form-item__content {
    margin-left: 0;
  }
}
</style>