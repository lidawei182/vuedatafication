<template>
  <el-form
    ref="loginForm"
    :model="loginForm"
    :rules="loginRules"
    class="login-form-li"
    auto-complete="off"
    label-position="left"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <div class="loginCodeImg-item">
      <div class="title-container">
        <dv-decoration-7 
          :color="['#14267f', '#14267f']" 
          style="width:280px;height:50px;">
          &nbsp;
          <h3 class="title">{{ $t('login.title') }}</h3>
          &nbsp;
        </dv-decoration-7>
      </div>
    </div>>
    <div class="login-form-li-box">
      <el-form-item prop="username" ref="userdom">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          auto-complete="off"
          clearable
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="passwordType"
          v-model="loginForm.password"
          :placeholder="$t('login.password')"
          name="password"
          auto-complete="off"
          @keyup.enter.native="handleLogin"
          clearable
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item prop="code">
        <el-row :span="24">
          <el-col :span="14">
            <span class="svg-container">
              <svg-icon icon-class="guide" />
            </span>
            <el-input
              v-model="loginForm.code"
              :placeholder="$t('login.code')"
              name="code"
              auto-complete="off"
              @keyup.enter.native="handleLogin"
              :maxlength="code.len"
              clearable
            />
          </el-col>
          <el-col :span="6">
            <div class="login-code">
              <span
                class="login-code-img"
                @click="refreshCode"
                v-if="code.type == 'text'"
              >{{code.value}}</span>
              <img :src="code.src" class="login-code-img" @click="refreshCode" v-else />
              <span class="show-pwd" @click="refreshCode">
                <i class="el-icon-refresh" />
              </span>
            </div>
          </el-col>
        </el-row>
      </el-form-item>
      <div class="login-logIn">
        <el-button
          :loading="loading"
          style="width:71%;"
          @click.native.prevent="handleLogin"
        >{{ $t('login.logIn') }}</el-button>
      </div>
      <div class="binding-button" @click="bindingClick">绑定序列码</div>
    </div>
    <slide-verify
      v-if="msg == 'displayLogin'"
      :l="42"
      :r="10"
      :w="w_img"
      :h="h_img"
      @success="onSuccess"
      @fail="onFail"
      @refresh="onRefresh"
      :slider-text="sy"
    />
    <binding 
      :show="bindingBar" 
      :title="bindingTitle"
      :wb="wb"
      :hb="hb"
      @showBindingBar="showBindingBar($event)">
      <div class="binding-bar">
        <bindingForm
          :delfile-name="delfileName"
          @bindingSubmit="bindingSubmit" 
          @bindingDataurl="bindingDataurl" />
      </div>
    </binding>
  </el-form>
</template>

<script>
import slideVerify from "./slideverify";
import { randomLenNum } from "../../utils/util";
import binding from "./binding";
import bindingForm  from "./bindingForm ";
import { delfile } from '@/api/login'
export default {
  name: "userLogin",
  components: { slideVerify, binding, bindingForm},
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于6位"));
      } else {
        callback();
      }
    };
    const validateCode = (rule, value, callback) => {
      if (this.code.value != value) {
        this.loginForm.code = "";
        this.refreshCode();
        callback(new Error("请输入正确的验证码"));
      } else {
        callback();
      }
    };
    return {
      delfileName:'0',
      wb: 100, 
      hb: 640,
      bindingTitle:"绑定账号",
      bindingBar: false, //绑定账号显示框
      fullscreenLoading: false,
      w_img: 440,
      h_img: 250,
      loginForm: {
        username: "",
        password: "",
        code: "",
        redomStr: ""
      },
      code: {
        src: "",
        value: "",
        len: 4,
        type: "text"
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { min: 4, max: 4, message: "验证码长度为4位", trigger: "blur" },
          { required: true, trigger: "blur", validator: validateCode }
        ]
      },
      passwordType: "password",
      loading: false,
      redirect: undefined,
      msg: "",
      sy: "向右滑动",
      bindingDataurlVal: ''
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    //初始化验证码
    this.refreshCode();
  },
  destroyed() {},
  mounted() {
    this.msg = "";
    this.setimgm();
  },
  methods: {
    bindingDataurl(e){
      this.bindingDataurlVal = e;
    },
    //绑定账号提交表单
    bindingSubmit(){
      this.bindingBar = !this.bindingBar;
    },
    //绑定账号显示隐藏
    showBindingBar(e) {
      if(this.bindingDataurlVal != ''){
        let data = { img: this.bindingDataurlVal };
        let that = this;
        delfile(data).then(response => {
          if(response.data.unlink){
            that.$message({
              message: response.msg,
              type: 'success'
            });
            that.delfileName = '1';
          }else{
            that.$message({
              message: response.msg,
              type: 'warning'
            });
            that.delfileName = '0';
          }
        })
      }
      this.bindingBar = e;
    },
    // 绑定账号
    bindingClick() {
      this.delfileName = '0';
      this.bindingBar = !this.bindingBar;
    },
    refreshCode() {
      //验证码
      this.loginForm.redomStr = randomLenNum(this.code.len, true);
      this.code.type == "text"
        ? (this.code.value = randomLenNum(this.code.len))
        : (this.code.src = `${this.codeUrl}/${this.loginForm.redomStr}`);
      // this.loginForm.code = this.code.value;
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 显示滑动验证
          this.msg = "displayLogin";
        } else {
          this.$message.error("请输入正确的账号和密码");
          return false;
        }
      });
    },
    openFullScreen() {
      // 延迟加载等待
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 2000);
    },
    setimgm() {
      // 滑动宽度获取
      let setWidth = this.$refs.userdom.$el.offsetWidth;
      if (setWidth < 450) {
        this.w_img = setWidth;
      } else {
        this.w_img = 450;
      }
    },
    onSuccess() {
      this.openFullScreen();
      // 滑动校验成功登陆
      this.msg = "login";
      this.loading = true;
      this.$store
        .dispatch("LoginByUsername", this.loginForm)
        .then(() => {
          this.$router.push({ path: this.redirect || "/" });
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
          this.msg = "";
        });
    },
    onFail() {
      // 滑动失败
      this.$message.error("请正确滑动验证");
      this.msg = "";
    },
    onRefresh() {
      // 滑动刷新
      this.msg = "displayLogin";
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #011531;
  $cursor: #fff;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .el-input input {
      color: $cursor;
      &::first-line {
        color: $light_gray;
      }
    }
  }
  /deep/ input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 0px transparent inset !important;
  }
  input:-internal-autofill-previewed,
  input:-internal-autofill-selected {
    -webkit-text-fill-color: #FFFFFF !important;
    transition: background-color 5000s ease-in-out 0s !important;
  }
  /deep/ input:-internal-autofill-selected {
      transition: background-color 5000s ease-in-out 0s !important;
      background-color: transparent !important;
  }
#login-container {
  // 绑定账号样式
  .binding-bar{
    width: 80%;
    margin: 0 auto;
    padding: 40px 0 0 0;
  }
  // 设置登录页面样式 
  .login-form-li {
    background-color: rgba(8, 19, 75, 0.75);
    border-radius: 8px;
    display: flex;
    overflow: hidden;
    .loginCodeImg-item{ 
      width: 50%;
      background-color: #fff;
      background-image:url('../../../public/img/login-code-img.png');
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: 0 40px;
      overflow: hidden;
      .title-container {
        position: relative;
        display: -webkit-box; /* 老版本语法: Safari, iOS, Android browser, older WebKit browsers. */
        display: -moz-box; /* 老版本语法: Firefox (buggy) */
        display: -ms-flexbox; /* 混合版本语法: IE 10 */
        display: -webkit-flex; /* 新版本语法: Chrome 21+ */
        display: flex; /* 新版本语法: Opera 12.1, Firefox 22+ */
        flex-direction: column;
        justify-content: center; //主轴方向，默认水平方向
        align-items: center; // 交叉轴方向，默认垂直方向
        top: 20px;
        .title {
          font-size: 16px;
          margin: 0;
          color: #14267f;
          font-weight: 550;
          line-height: 50px;
        }
      }
    }
    .login-form-li-box{
      width: 50%;
      padding: 5% 2% 2% 2%;
      .login-logIn{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        left: -2px;
        .el-button--medium {
          padding: 10px;
          font-size: 14px;
          border-radius: 4px;
          margin: 0 auto;
        }
      }
      // 绑定按钮
      .binding-button{
        color: $cursor;
        text-align: center;
        padding-top: 20px;
        padding-bottom: 8px;
        font-size: 14px;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .el-input {
      display: inline-block;
      width: 70%;
      margin-left: 10px;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        color: $light_gray;
        caret-color: $cursor;
        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.login-code {
  margin-top: 4px;
  margin-right: -3px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.login-code-img {
  width: 100%;
  height: 100%;
  background-color: #fdfdfd;
  border: 1px solid #f0f0f0;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 5px;
  line-height: 34px;
  text-indent: 5px;
  text-align: center;
  border-radius: 4px;
}
</style>
