<template> 
  <div :style="styleFlatcake" class="ilencake">
    <div :id="className" :ref="className" :style="{height: height}"></div>
  </div>
</template>
<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
export default {
  name: "LineDoughnut",
  props: { 
    styleFlatcake: {
      type: Object,
      required: true
    },
    className: {
      type: String,
      default: 'chart'
    },
    classNames: {
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
    autoResize: {
      type: Boolean,
      default: true
    },
    chartPieData: {
      type: Object,
      required: true
    },
    setIntervalGet: {
      type: Number,
      required: 60000
    }
  },
  data() {
    return {
      myChart:'',
      dom:'',
      chartlienDatais: this.chartPieData,
    };
  },
  watch: {
    chartPieData: {  
      handler: function (val) {
        let that = this;
        that.chartlienDatais = val;
        try{
          if(that.myChart.setOption){
            that.myChart.setOption(that.chartlienDatais);
          }
        }catch(error){
          console.log(error);
        }
      },
      immediate: true,
      deep: true		   
    },
  },
  created() {},
  destroyed() {},
  mounted() {
    let that = this;
    that.$nextTick(() => {
      that.dom = that.$refs[that.className];
      that.myChart = echarts.init(that.dom, null, {
        renderer: "canvas",
        useDirtyRect: false
      });
      that.myChart.setOption(that.chartlienDatais);
      window.addEventListener("resize", that.myChart.resize);
      //setInterval(() => {}, that.setIntervalGet)
    });
  },
  methods: {
    aroundflatcake() {
      let dom = this.$refs[this.className];
      let myChart = echarts.init(dom, null, {
        renderer: "canvas",
        useDirtyRect: false
      });
      let option = this.chartPieData;
      if (option && typeof option === "object") {
        myChart.setOption(option);
      }
      window.addEventListener("resize", myChart.resize);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.ilencake{
  width: 100%;
  height: 100%;
}
</style>