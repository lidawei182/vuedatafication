<template>
  <div id="login-container">
    <threeLogin></threeLogin>
    <transition name="hello">
      <div class="transition-hello" v-if="show">
        <userLogin></userLogin>
      </div>
    </transition>
    
  </div>
</template>
<script>
import threeLogin from "./threelogin";
import userLogin from "./userlogin";
export default {
  name: "LoginIndex",
  components: { userLogin, threeLogin },
  data() {
    return {
      show:false
    };
  },
  watch: {},
  created() {},
  destroyed() {},
  mounted() {
    this.slideFade();
  },
  methods: {
    slideFade() {
      this.show = !this.show;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #011531;
/* reset element-ui css */
#login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
}
.transition-hello{
  position: absolute;
  right: 0;
  width: 620px;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
}
.hello-enter-active {
  transition: all 1.2s ease;
}
.hello-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.hello-enter, .hello-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(-100000px);
}
</style>