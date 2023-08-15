<template>
  <div :style="styleFlatcake" class="flatcake">
    <div :id="className" :ref="className" :style="{height: height}"></div>
  </div>
</template>
<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
export default {
  name: "PieDoughnut",
  props: {
    styleFlatcake: {
      type: Object,
      required: true 
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
      chartPieDatais: this.chartPieData,
      piemyChart: ''
    };
  },
  watch: {
    chartPieData: {  
      handler: function (val) {
        let that = this;
        that.chartPieDatais = val;
        try{
          if(that.piemyChart.setOption){
            that.piemyChart.setOption(that.chartPieDatais);
          }
        }catch(error){
          console.log(error);
        }
      },
      immediate: true,
      deep: true		   
    },
  },
  created() {

  },
  destroyed() {},
  mounted() {
    let that = this;
    this.$nextTick(() => {
      let dom = this.$refs[this.className];
      this.piemyChart = echarts.init(dom, null, {
        renderer: "canvas",
        useDirtyRect: false 
      });
      this.piemyChart.setOption(this.chartPieDatais);
      window.addEventListener("resize", that.piemyChart.resize);
      // setInterval(() => {}, that.setIntervalGet)
    });
  },
  methods: {
    aroundflatcake(data) {
      let dom = this.$refs[this.className];
      this.piemyChart = echarts.init(dom, null, {
        renderer: "canvas",
        useDirtyRect: false
      });
      let option = data;
      if (option && typeof option === "object") {
        this.piemyChart.setOption(option);
      }
      window.addEventListener("resize", this.piemyChart.resize);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.flatcake {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>