<template>
  <div class="frame-item-container-conter">

    <div class="frame-item-text">
      <div style="display: flex; align-items: center;">
        <dv-decoration-6 style="width:6vh;height:2vh;" />
        <span>报警通知</span>
      </div>
      <span>当前呼叫 {{numberCallsNumber}}</span>
      <span @click="clickLink(routePath,basePath,$event)">
        <el-link type="primary">更多</el-link>
    </span>
    </div>

    <!-- 95px -->
    <div class="frame-item-container">
      <dv-border-box-2
        style="width:46%;" 
        :style="{ height: screenStyle === true ? '7vh' : '7vh'}"
        :color="['#0931b5', '#7c95e8']"
        v-for="(item,index) in dataFrameItem" 
        :key="index">
        <alertInformation :alert-information-data="item" />
      </dv-border-box-2>
    </div>
    
  </div> 
</template>
<script>
import path from "path";
import { validateURL } from "@/utils/validate";
import alertInformation from "@/components/datavdata/components/alertInformation";
export default {
  name: "FrameItem",
  components: {
    alertInformation
  },
  props: {
    numberCalls:{
      type: Number,
      default: function() {
        return 0;
      }
    },
    callData: {
      type: Array,
      required: []
    },
    callScreenStyle: {
      type: Boolean,
      default: true
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
  },
  data() {
    return {
      routePath: "callslist",
      basePath: "/call",
      dataFrameItem:[],
      dataItem:{oldmanname:'无报警通知', status:"", Address:'',calltime:'',taketime:''},
      screenStyle: true,
      framoffsetHeight: 0,
      numberCallsNumber: 0,
    };
  },
  watch: {
    callData: {  
      handler: function (val) { 
          this.dataFrameItem = val;
          let that = this;
          that.framoffsetHeight = document.body.offsetHeight;
          if(that.framoffsetHeight > 800){
            that.forHeight(10);
          }else{
            that.forHeight(8);
          }
      },
      immediate: true,   //首次加载时执行监听
      deep: true		   //值改变时执行监听
    },
    callScreenStyle : {
      handler: function (val) { 
          this.screenStyle = val;
      },
      immediate: true, 
      deep: true		 
    },
    numberCalls : {
      handler: function (val) { 
          this.numberCallsNumber = val;
      },
      immediate: true, 
      deep: true		 
    }
  },
  created() { },
  destroyed() { },
  mounted() {
    let that = this;
    that.$nextTick(() => {
      that.numberCallsNumber = that.numberCalls;
      that.onresizeForHeight();
    });
  },
  methods: {
    onresizeForHeight(){
      let that = this;
      that.framoffsetHeight = document.body.offsetHeight;
      if(that.framoffsetHeight > 800){
        that.forHeight(10);
      }else{
        that.forHeight(8);
      }
      window.onresize = () => {
        return (() => {
          that.framoffsetHeight = document.body.offsetHeight;
          if(that.framoffsetHeight > 800){
            that.forHeight(10);
          }else{
            that.forHeight(8);
          }
        })();
      };
    },
    forHeight(sum){
      let that = this;
      for(let i = 0; sum > i; i++){
          if(i == that.dataFrameItem.length && i < sum){
            that.dataFrameItem[i] = that.dataItem
          }
        }
    },
    resolvePath(basePath, routePath) {
      return path.resolve(basePath, routePath);
    },
    isExternalLink(routePath) {
      return validateURL(routePath);
    },
    clickLink(routePath, basePath, e) {
      if (!this.isExternalLink(routePath)) {
        e.preventDefault();
        const path = this.resolvePath(basePath, routePath);
        this.$router.push(path);
      }
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.frame-item-container-conter {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  .frame-item-text {
    width: 90%;
    height: 2vh;
    color: #ffffff;
    font-size: 1vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & span {
      padding-left: 5px;
    }
  }

  .frame-item-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
}
</style>