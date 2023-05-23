<template>
  <div class="dashboard-editor-container">

    <div class="datav-container-box" style="height: 66%;">

      <div class="datav-container-left">
        <!-- 545px -->
        <div class="datav-container-left-top" style="height:66%;">
          <dv-border-box-1 :color="['#01193b', '#7c95e8']" style="height:100%;">
            <FrameItem :call-data="calllist" :call-screen-style="screenStyle" :number-calls="calllistTotal" />
          </dv-border-box-1>
        </div>
        <!-- 260px -->
        <div id="alineids" class="datav-container-left-top" style="margin-top: 1%;"
          :style="{ height: screenStyle === true ? '34%' : '34%' }">
          <dv-border-box-6 style="width:100%;height:100%;" :color="['#0931b5', '#7c95e8']">
            <el-select class="selectDataValue" @change="optionschange" v-model="dateValue" placeholder="请选择">
              <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.name"></el-option>
            </el-select>
            <div class="total-calls">总共呼叫数量{{ calllistCount }}</div>
            <LineDoughnut :set-interval-get="set_interval" :style-flatcake="{}" :chart-pie-data="callStatistics"
              class-name="alineid" class-names="alineids" />
          </dv-border-box-6>
        </div>

      </div>
      <!-- 830px -->
      <div class="datav-container-right">
        <dv-border-box-8 class="datav-container-right-dv-border" ref="dvborderbox8ref" id="dvborderbox8ref"
          :style="{ height: screenStyle === true ? '100%' : '100%' }" style="background: #032f63;">
          <screenfull @screenClick="screenClick($event)" class="right-menu-item" />
          <MapBaidu 
            ref="MapBaiduref" 
            id="MapBaiduref" 
            :map-baidu-data="responseData"
            @fixedPosition="mapbaiduv" />
          <!-- <el-cascader 
              class="cascaderDataValue"
              v-model="changingIsoverModel" 
              :options="changingIsover"
              @change="handleChange">
            </el-cascader> -->
        </dv-border-box-8>
      </div>

    </div>

    <!-- 360px -->
    <div class="datav-container-bottom" style="height: 30%;">
      <div class="datav-box-content-bottom" :style="{ height: screenStyle === true ? '100%' : '100%' }">
        <dv-border-box-13 style="width:20%;">
          <div class="frame-item-box" id="alineHistogramids">

            <div class="frame-item-title-li">
              <dv-decoration-3 style="width:68px;height:25px;" />
              <span>年龄/性别分布</span>
            </div>

            <LineDoughnut :set-interval-get="set_interval" :style-flatcake="{}" :chart-pie-data="histogram"
              class-name="alineHistogramid" class-names="alineHistogramids" />

          </div>
        </dv-border-box-13>

        <dv-border-box-13 style="width:20%;">
          <div class="frame-item-box">
            <div class="frame-item-title-li">
              <dv-decoration-3 style="width:68px;height:25px;" />
              <span>居住情况</span>
            </div>
            <div class="marriage-amount-to">总计：{{ total }}</div>
            <PieDoughnut :set-interval-get="set_interval" :style-flatcake="{}" :chart-pie-data="chartRefererData"
              class-name="refererid" />
          </div>
        </dv-border-box-13>

        <dv-border-box-13 style="width:20%;">
          <div class="frame-item-box">
            <div class="frame-item-title-li">
              <dv-decoration-1 style="width:68px;height:25px;" />
              <span>老人类型统计</span>
            </div>
            <div class="marriage-amount-to">总计：{{ total }}人</div>
            <PieDoughnut :set-interval-get="set_interval" :style-flatcake="{}" :chart-pie-data="statisticsElderlyTypes"
              class-name="refererid" />
          </div>
        </dv-border-box-13>

        <dv-border-box-13 style="width:20%;">
          <div class="frame-item-box">
            <div class="frame-item-title-li">
              <dv-decoration-3 style="width:68px;height:25px;" />
              <span>婚姻统计</span>
            </div>
            <div class="marriage-amount-to">总计：{{ total }}</div>
            <PieDoughnut :set-interval-get="set_interval" :style-flatcake="{}" :chart-pie-data="chartDougData"
              class-name="flatcakeid" />
          </div>
        </dv-border-box-13>

        <dv-border-box-13 style="width:20%;">
          <div class="frame-item-box">
            <div class="frame-item-title-li">
              <dv-decoration-1 style="width:68px;height:25px;" />
              <span>健康统计</span>
            </div>
            <div class="marriage-amount-to">总计：{{ total }}</div>
            <div class="frame-look-over-li">

              <div v-for="(item, index) in dataHealthy" :key="index" style="line-height: 22px;">
                <i v-if="index == 0" class="el-icon-star-on frame-look-over-i" style="color:#3683f6;" />
                <i v-else-if="index == 1" class="el-icon-star-on frame-look-over-i" style="color:#fdcf41;" />
                <i v-else-if="index == 2" class="el-icon-star-on frame-look-over-i" style="color:#03ae24;" />
                <i v-else-if="index == 3" class="el-icon-star-on frame-look-over-i" style="color:#b54501;" />
                <span>{{ item.name }}:</span>
                <span>{{ item.value }}人</span>
              </div>

            </div>
            <dv-charts :option="healthStatistics" />
          </div>
        </dv-border-box-13>

      </div>
    </div>

  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Screenfull from "@/components/Screenfull";
import pieConfig from "@/components/datavdata/dataConfig/pieConfig";
import lineConfig from "@/components/datavdata/dataConfig/lineConfig";
import histogramConfig from "@/components/datavdata/dataConfig/histogramConfig";
import callStatisticsConfig from "@/components/datavdata/dataConfig/callStatistics";
import MapBaidu from "@/components/datavdata/components/mapBaidu";
import PieDoughnut from "@/components/datavdata/components/pieDoughnut";
import LineDoughnut from "@/components/datavdata/components/lineDoughnut";
import FrameItem from "@/components/datavdata/components/frameItem";
import { dataIntegration } from '@/api/dashboard';
export default {
  name: "DashboardAdmin",
  components: {
    Screenfull,
    MapBaidu,
    PieDoughnut,
    LineDoughnut,
    FrameItem
  },
  computed: {
    ...mapGetters([
      'group',
      'jdno'
    ]),
  },
  data() {
    return {
      framoffsetHeight: 0,
      calllistTotal: 0, // 当前呼叫数
      timerSetInterval: '',
      get_month: [],
      themoonarraylist: [],
      timecalllist: [],
      calllistCount: 0,
      calllist: [],
      dataHealthy: [],
      responseData: [],
      total: 0,
      set_interval: 1000 * 60 * 4,
      screenStyle: true,
      pieConfig: pieConfig,
      lineConfig: lineConfig,
      histogramConfig: histogramConfig,
      callStatisticsConfig: callStatisticsConfig,
      chartDougData: {},
      chartRefererData: {},
      histogram: {},
      callStatistics: {},
      statisticsElderlyTypes: {},
      healthStatistics: {},
      options: [
        {
          name: '月',
          value: "1"
        },
        {
          name: '年',
          value: "2"
        }
      ],
      dateValue: "月",
      changingIsoverModel: ['0'],
      changingIsover: [
        {
          value: '1',
          label: '沈阳',
          children: [
            {
              value: 'shejiyuanze',
              label: '沈北新区',
              children: [
                {
                  value: 'yizhi',
                  label: '小区1'
                }, {
                  value: 'fankui',
                  label: '小区2'
                }
              ]
            },
            {
              value: 'shejiyuanze',
              label: '浑南区',
              children: [
                {
                  value: 'yizhi',
                  label: '小区1'
                }, {
                  value: 'fankui',
                  label: '小区2'
                }, {
                  value: 'fankui',
                  label: '小区3'
                }
              ]
            },
          ]
        }
      ]
    };
  },
  mounted() {
    // console.log(this.group)
    // console.log(this.jdno)

    // window.addEventListener('resize', this.MapApiResize())
    
    // 呼叫
    this.callStatistics = callStatisticsConfig.lineData;
    // 年龄
    this.histogram = histogramConfig.lineData;
    // 居住情况
    this.chartRefererData = this.pieConfig.chartRefererData;
    // 老人类型
    this.statisticsElderlyTypes = pieConfig.statisticsElderlyTypes;
    //婚姻状态
    this.chartDougData = this.pieConfig.chartDougData;
    //健康状态
    this.healthStatistics = pieConfig.healthStatistics;

    this.framoffsetHeight = document.body.offsetHeight;

    if (this.framoffsetHeight > 800) {
      this.callStatistics.grid.height = "62%";
      this.callStatistics.grid.y = "26%";
      this.histogram.grid.height = '60%';
      this.histogram.grid.y = "30%";
      this.histogram.legend.top = "25px";
    } else {
      this.callStatistics.grid.height = "48%";
      this.callStatistics.grid.y = "34%";
      this.histogram.grid.height = '45%';
      this.histogram.grid.y = "40%";
      this.histogram.legend.top = "35px";
    }

    let that = this;
    that.iniIntegration();
    // clearInterval
    that.timerSetInterval = setInterval(() => {
      console.log('4分钟');
      that.iniIntegration();
    }, that.set_interval)

  },
  beforeDestroy() {
    let that = this;
    clearInterval(that.timerSetInterval);
    that.timerSetInterval = '';
  },
  methods: {
    MapApiResize(){
      // 地图宽度 备用
      this.$nextTick(() => {
        let dvborderbox8 = document.getElementById("dvborderbox8ref");
        let MapBaiduval = document.getElementById("MapBaiduref");
        this.dvborderboxssize(dvborderbox8, MapBaiduval);
      });
    },
    dvborderboxssize(container, MapBaiduval) {
      function getStyle(el) {
        if (window.getComputedStyle) {
          return window.getComputedStyle(el, null);
        } else {
          return el.currentStyle;
        }
      }
      let wi = getStyle(container, 'width').width;
      // let hi = getStyle(container, 'height').height;
      let wp1 = wi.indexOf("p");
      let wi2 = wi.substr(0, wp1);
      wi2 = wi2 - (wi2 * 0.007);
      wi2 = wi2 + 'px';
      MapBaiduval.style.width = wi2;
    },
    iniIntegration() {

      let that = this;

      let themoonarraylist = JSON.stringify(this.themoonarraylist);

      if (this.dateValue == '月') {
        that.themoon();
        themoonarraylist = JSON.stringify(this.themoonarraylist);
      }
      if (this.dateValue == '年') {
        this.getMonthData();
        themoonarraylist = this.get_month;
      }
      let datalist = {
        jdno: this.jdno,
        dateValue: this.dateValue,
        themoonarraylist: themoonarraylist
      }

      dataIntegration(JSON.stringify(datalist)).then(response => {
        if (response.status == 1) {
          console.log(response.data);
          let data = response.data.tree;
          let calllist = response.data.calllist;
          let calllistTotal = response.data.calllistTotal;
          that.calllist = calllist;
          that.calllistTotal = calllistTotal;

          // 月 - 呼叫
          let themoonCount = response.data.themoonCount;
          // 月 - 异常
          let themoonAbnormal = response.data.themoonAbnormal;

          let themoonCountArray = [];

          let themoonAbnormalArray = [];

          // 呼叫总数
          that.calllistCount = 0;

          for (let i = 0; themoonCount.length > i; i++) {
            themoonCountArray.push(themoonCount[i].counts);
            // 呼叫总数相加
            that.calllistCount += themoonCount[i].counts;
          }

          for (let i = 0; themoonAbnormal.length > i; i++) {
            themoonAbnormalArray.push(themoonAbnormal[i].counts);
          }

          that.callStatistics.series[0].data = themoonCountArray;

          that.callStatistics.series[1].data = themoonAbnormalArray;

          // 总人数 =》 tree
          that.total = data.length;

          //需要定时执行的代码
          that.setarrayResidence(data);
        }
      })
    },
    themoon() {
      // .replaceAll("/", "-")
      let getDate = new Array(31).fill(0).map((_, idx) =>
        new Date(new Date().getTime() - idx * (24 * 60 * 60 * 1000)).toLocaleDateString().replace(/,/g,'-')
      ).reverse();
      let getDatearray1 = []
      let getDatearray2 = []
      let getDatearray3 = []
      let getDatearray4 = []
      let getDatearray5 = []
      let getDatearray6 = []
      let getDatearray7 = []
      let getDatearray8 = []
      for (let i = 0; getDate.length > i; i++) {
        if (i < 4) {
          getDatearray1.push(getDate[i])
        }
        if (i >= 4 && i < 8) {
          getDatearray2.push(getDate[i])
        }
        if (i >= 8 && i < 12) {
          getDatearray3.push(getDate[i])
        }
        if (i >= 12 && i < 16) {
          getDatearray4.push(getDate[i])
        }
        if (i >= 16 && i < 20) {
          getDatearray5.push(getDate[i])
        }
        if (i >= 20 && i < 24) {
          getDatearray6.push(getDate[i])
        }
        if (i >= 24 && i < 28) {
          getDatearray7.push(getDate[i])
        }
        if (i >= 28 && i < 32) {
          getDatearray8.push(getDate[i])
        }
      }
      let getDatearray11 = getDatearray1[0].slice(5, 9) + '至' + getDatearray1[getDatearray1.length - 1].slice(5, 9);
      let getDatearray22 = getDatearray2[0].slice(5, 9) + '至' + getDatearray2[getDatearray2.length - 1].slice(5, 9);
      let getDatearray33 = getDatearray3[0].slice(5, 9) + '至' + getDatearray3[getDatearray3.length - 1].slice(5, 9);
      let getDatearray44 = getDatearray4[0].slice(5, 9) + '至' + getDatearray4[getDatearray4.length - 1].slice(5, 9);
      let getDatearray55 = getDatearray5[0].slice(5, 9) + '至' + getDatearray5[getDatearray5.length - 1].slice(5, 9);
      let getDatearray66 = getDatearray6[0].slice(5, 9) + '至' + getDatearray6[getDatearray6.length - 1].slice(5, 9);
      let getDatearray77 = getDatearray7[0].slice(5, 9) + '至' + getDatearray7[getDatearray7.length - 1].slice(5, 9);
      let getDatearray88 = getDatearray8[0].slice(5, 9) + '至' + getDatearray8[getDatearray8.length - 1].slice(5, 9);

      let setDatearray = [
        [getDatearray1[0], getDatearray1[getDatearray1.length - 1]],
        [getDatearray2[0], getDatearray2[getDatearray2.length - 1]],
        [getDatearray3[0], getDatearray3[getDatearray3.length - 1]],
        [getDatearray4[0], getDatearray4[getDatearray4.length - 1]],
        [getDatearray5[0], getDatearray5[getDatearray5.length - 1]],
        [getDatearray6[0], getDatearray6[getDatearray6.length - 1]],
        [getDatearray7[0], getDatearray7[getDatearray7.length - 1]],
        [getDatearray8[0], getDatearray8[getDatearray8.length - 1]],
      ];

      this.callStatistics.xAxis[0].data = [getDatearray11, getDatearray22, getDatearray33, getDatearray44, getDatearray55, getDatearray66, getDatearray77, getDatearray88];
      // 上传数据
      this.themoonarraylist = setDatearray;
      console.log(this.themoonarraylist)

    },
    getMonthData() {
      let get_month = this.getMonth();

      let get_month_array1 = [];
      let get_month_array2 = [];
      let get_month_array3 = [];
      let get_month_array4 = [];
      let get_month_array5 = [];
      let get_month_array6 = [];
      let get_month_array7 = [];
      let get_month_array8 = [];
      let get_month_array9 = [];
      let get_month_array10 = [];
      let get_month_array11 = [];
      let get_month_array12 = [];

      for (let i = 0; get_month.length > i; i++) {
        if (i < 2) {
          get_month_array1.push(get_month[i])
        }
        if (i >= 1 && i < 3) {
          get_month_array2.push(get_month[i])
        }
        if (i >= 2 && i < 4) {
          get_month_array3.push(get_month[i])
        }
        if (i >= 3 && i < 5) {
          get_month_array4.push(get_month[i])
        }
        if (i >= 4 && i < 6) {
          get_month_array5.push(get_month[i])
        }
        if (i >= 5 && i < 7) {
          get_month_array6.push(get_month[i])
        }
        if (i >= 6 && i < 8) {
          get_month_array7.push(get_month[i])
        }
        if (i >= 7 && i < 9) {
          get_month_array8.push(get_month[i])
        }
        if (i >= 8 && i < 10) {
          get_month_array9.push(get_month[i])
        }
        if (i >= 9 && i < 11) {
          get_month_array10.push(get_month[i])
        }
        if (i >= 10 && i < 12) {
          get_month_array11.push(get_month[i])
        }
        if (i >= 11 && i < 13) {
          get_month_array12.push(get_month[i])
        }
      }

      let nextMonthToday12 = new Date(
        new Date().getTime() + 30 * 24 * 60 * 60 * 1000
      );
      let nextMonthYear12 = nextMonthToday12.getFullYear();
      let nextMonth12 = nextMonthToday12.getMonth() + 1;
      nextMonth12 = nextMonth12 < 10 ? "0" + nextMonth12 : nextMonth12;
      let nextMonthJsrq12 = nextMonthYear12 + "-" + nextMonth12;
      get_month_array12.push(nextMonthJsrq12);

      let get_month_cont = [get_month_array1, get_month_array2,
        get_month_array3, get_month_array4,
        get_month_array5, get_month_array6,
        get_month_array7, get_month_array8,
        get_month_array9, get_month_array10,
        get_month_array11, get_month_array12,
      ];

      this.callStatistics.xAxis[0].data = get_month;

      this.get_month = get_month_cont;
    },
    getMonth() {
      var dataArr = [];
      var data = new Date();
      var year = data.getFullYear();
      data.setMonth(data.getMonth() + 1, 1); //获取到当前月份,设置月份
      for (var i = 0; i < 12; i++) {
        data.setMonth(data.getMonth() - 1); //每次循环一次 月份值减1
        var m = data.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        dataArr.push(data.getFullYear() + "-" + m);
      }
      return dataArr.reverse();
    },
    optionschange(e) {

      let that = this;

      this.dateValue = e;
      let themoonarraylist = JSON.stringify(this.themoonarraylist);
      if (this.dateValue == '月') {
        this.themoon();
        themoonarraylist = JSON.stringify(this.themoonarraylist);
      }
      if (this.dateValue == '年') {
        this.getMonthData();
        themoonarraylist = this.get_month;
      }

      let datalist = {
        jdno: this.jdno,
        dateValue: this.dateValue,
        themoonarraylist: themoonarraylist
      }

      dataIntegration(JSON.stringify(datalist)).then(response => {
        if (response.status == 1) {
          console.log(response.data);
          //呼叫
          let themoonCount = response.data.themoonCount;
          //异常
          let themoonAbnormal = response.data.themoonAbnormal;

          let themoonCountArray = [];

          let themoonAbnormalArray = [];

          that.calllistCount = 0;

          for (let i = 0; themoonCount.length > i; i++) {
            themoonCountArray.push(themoonCount[i].counts);
            // 呼叫总数相加
            that.calllistCount += themoonCount[i].counts;
          }

          for (let i = 0; themoonAbnormal.length > i; i++) {
            themoonAbnormalArray.push(themoonAbnormal[i].counts);
          }

          that.callStatistics.series[0].data = themoonCountArray;

          that.callStatistics.series[1].data = themoonAbnormalArray;

        }

      })

    },
    GetAge(identityCard) {
      var len = (identityCard + "").length;
      if (len == 0) {
        return 0;
      } else {
        if ((len != 15) && (len != 18))//身份证号码只能为15位或18位其它不合法
        {
          return 0;
        }
      }
      var strBirthday = "";
      if (len == 18)//处理18位的身份证号码从号码中得到生日和性别代码
      {
        strBirthday = identityCard.substr(6, 4) + "/" + identityCard.substr(10, 2) + "/" + identityCard.substr(12, 2);
      }
      if (len == 15) {
        strBirthday = "19" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
      }
      //时间字符串里，必须是“/”
      var birthDate = new Date(strBirthday);
      var nowDateTime = new Date();
      var age = nowDateTime.getFullYear() - birthDate.getFullYear();
      //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
      if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    setarrayResidence(data) {
      let that = this;
      //女
      let arraysex1 = [];
      //男
      let arraysex2 = [];

      // 居住情况 Residence_state
      // "其他" "独居" "空巢" "与亲戚同居" "与子女同居" "集中居住"
      //"其他" 
      let arrayResidence1 = [];
      //"独居"
      let arrayResidence2 = [];
      //"空巢"
      let arrayResidence3 = [];
      //"与亲戚同居"
      let arrayResidence4 = [];
      //"与子女同居"
      let arrayResidence5 = [];
      //"集中居住"
      let arrayResidence6 = [];

      //老人类型  oldman_type
      //特困老人 独居老人 失婚老人 低保老人 其他
      //特困老人
      let array_oldman_type1 = [];
      //独居老人
      let array_oldman_type2 = [];
      //失婚老人
      let array_oldman_type3 = [];
      //低保老人
      let array_oldman_type4 = [];
      //其他
      let array_oldman_type5 = [];

      //婚姻状态 marital_status
      //未婚 已婚 离异 丧偶 未说明
      //未婚
      let array_marital_statu1 = [];
      //已婚
      let array_marital_statu2 = [];
      //离异
      let array_marital_statu3 = [];
      //丧偶
      let array_marital_statu4 = [];
      //未说明
      let array_marital_statu5 = [];

      // 健康状态  Healthy
      //能力完好
      let array_Healthy1 = [];
      //轻度失能
      let array_Healthy2 = [];
      //中度失能
      let array_Healthy3 = [];
      //重度失能
      let array_Healthy4 = [];

      let agesex1 = [];
      let agesex2 = [];
      that.responseData = [];
      for (let i = 0; data.length > i; i++) {

        let datamap = {
          title: data[i].oldmanname,
          point: data[i].longitude1 + ',' + data[i].latitude1,
          address: data[i].Address,
          tel: ""
        }

        that.responseData[i] = datamap;

        if (typeof (data[i].identity_card) == 'string') {
          data[i].identity_card = this.GetAge(data[i].identity_card);
        }

        if (data[i].sex == '女') {
          arraysex1.push(data[i]);
          agesex1.push(data[i].identity_card);
        } else {
          arraysex2.push(data[i]);
          agesex2.push(data[i].identity_card);
        }

        if (data[i].Residence_state == '==居住情况==' || data[i].Residence_state == '' || data[i].Residence_state == '其他' || data[i].Residence_state == null || data[i].Residence_state == "与陪护人员居住" || data[i].Residence_state == "与配偶居住") {
          arrayResidence1.push(data[i].Residence_state);
        } else if (data[i].Residence_state == '独居') {
          arrayResidence2.push(data[i].Residence_state);
        } else if (data[i].Residence_state == '空巢') {
          arrayResidence3.push(data[i].Residence_state);
        } else if (data[i].Residence_state == '与亲戚同居' || data[i].Residence_state == '与亲戚朋友居住' || data[i].Residence_state == '双居') {
          arrayResidence4.push(data[i].Residence_state);
        } else if (data[i].Residence_state == '与子女同居' || data[i].Residence_state == '与子女长住' || data[i].Residence_state == '与子女轮流居住') {
          arrayResidence5.push(data[i].Residence_state);
        } else if (data[i].Residence_state == '集中居住') {
          arrayResidence6.push(data[i].Residence_state);
        } else {
          arrayResidence1.push(data[i].Residence_state);
        }

        if (data[i].oldman_type == '特困老人') {
          array_oldman_type1.push(data[i].oldman_type);
        } else if (data[i].oldman_type == '独居老人') {
          array_oldman_type2.push(data[i].oldman_type);
        } else if (data[i].oldman_type == '失婚老人') {
          array_oldman_type3.push(data[i].oldman_type);
        } else if (data[i].oldman_type == '低保老人') {
          array_oldman_type4.push(data[i].oldman_type);
        } else if (data[i].oldman_type == '其他' || data[i].oldman_type == '==老人类型==' || data[i].oldman_type == null) {
          array_oldman_type5.push(data[i].oldman_type);
        } else {
          array_oldman_type5.push(data[i].oldman_type);
        }

        if (data[i].marital_status == '未婚') {
          array_marital_statu1.push(data[i].marital_status);
        } else if (data[i].marital_status == '已婚') {
          array_marital_statu2.push(data[i].marital_status);
        } else if (data[i].marital_status == '离异') {
          array_marital_statu3.push(data[i].marital_status);
        } else if (data[i].marital_status == '丧偶') {
          array_marital_statu4.push(data[i].marital_status);
        } else if (data[i].marital_status == '未说明' || data[i].marital_status == '==婚姻状态==' || data[i].marital_status == null) {
          array_marital_statu5.push(data[i].marital_status);
        } else {
          array_marital_statu5.push(data[i].marital_status);
        }

        if (data[i].Healthy == '重度失能') {
          array_Healthy4.push(data[i].Healthy);
        } else if (data[i].Healthy == '轻度失能') {
          array_Healthy2.push(data[i].Healthy);
        } else if (data[i].Healthy == '中度失能') {
          array_Healthy3.push(data[i].Healthy);
        } else if (data[i].Healthy == '能力完好') {
          array_Healthy1.push(data[i].Healthy);
        } else {
          array_Healthy1.push(data[i].Healthy);
        }


      };
      let dataResidence = [
        { name: "其他", value: arrayResidence1.length ? arrayResidence1.length : 0 },
        { name: "独居", value: arrayResidence2.length ? arrayResidence2.length : 0 },
        { name: "空巢", value: arrayResidence3.length ? arrayResidence3.length : 0 },
        { name: "与亲戚同居", value: arrayResidence4.length ? arrayResidence4.length : 0 },
        { name: "与子女同居", value: arrayResidence5.length ? arrayResidence5.length : 0 },
        { name: "集中居住", value: arrayResidence6.length ? arrayResidence6.length : 0 },
      ]
      that.chartRefererData.series[0].data = dataResidence;
      that.chartRefererData.series[1].data = dataResidence;
      let data_oldman_type = [
        { name: "特困老人", value: array_oldman_type1.length ? array_oldman_type1.length : 0 },
        { name: "独居老人", value: array_oldman_type2.length ? array_oldman_type2.length : 0 },
        { name: "失婚老人", value: array_oldman_type3.length ? array_oldman_type3.length : 0 },
        { name: "低保老人", value: array_oldman_type4.length ? array_oldman_type4.length : 0 },
        { name: "其他", value: array_oldman_type5.length ? array_oldman_type5.length : 0 },
      ]
      that.statisticsElderlyTypes.series[0].data = data_oldman_type;
      let data_marital_status = [
        { name: "未婚", value: array_marital_statu1.length ? array_marital_statu1.length : 0 },
        { name: "已婚", value: array_marital_statu2.length ? array_marital_statu2.length : 0 },
        { name: "离异", value: array_marital_statu3.length ? array_marital_statu3.length : 0 },
        { name: "丧偶", value: array_marital_statu4.length ? array_marital_statu4.length : 0 },
        { name: "未说明", value: array_marital_statu5.length ? array_marital_statu5.length : 0 },
      ]
      that.chartDougData.series[0].data = data_marital_status;
      let data_Healthy = [
        { name: "能力完好", value: array_Healthy1.length ? array_Healthy1.length : 0, radius: ['40%', '53%'] },
        { name: "轻度失能", value: array_Healthy2.length ? array_Healthy2.length : 0, radius: ['32%', '45%'] },
        { name: "中度失能", value: array_Healthy3.length ? array_Healthy3.length : 0, radius: ['31%', '47%'] },
        { name: "重度失能", value: array_Healthy4.length ? array_Healthy4.length : 0, radius: ['31%', '42%'] },
      ]
      that.dataHealthy = data_Healthy;
      that.updateHandler(data_Healthy);

      //[ '男806人','女265人' ]
      that.histogram.series[0].name = '男' + arraysex2.length + '人';
      that.histogram.series[1].name = '女' + arraysex1.length + '人';
      that.histogram.legend.data[0] = '男' + arraysex2.length + '人';
      that.histogram.legend.data[1] = '女' + arraysex1.length + '人';
      // 60 一下 60-70 70-80 80-90 90以上
      //let male = that.maxmin(agesex2);
      let malearray = that.maleFemale(agesex2);
      //let female = that.maxmin(agesex1);
      let femalearray = that.maleFemale(agesex1);
      that.histogram.series[0].data = malearray;
      that.histogram.series[1].data = femalearray;

    },
    maleFemale(data) {
      // 男
      let male59 = [];
      let male70 = [];
      let male80 = [];
      let male90 = [];
      let male91 = [];
      for (let i = 0; data.length > i; i++) {
        if (data[i] < 60) {
          male59.push(data[i])
        }
        if (data[i] >= 60 && data[i] <= 70) {
          male70.push(data[i])
        }
        if (data[i] >= 70 && data[i] <= 80) {
          male80.push(data[i])
        }
        if (data[i] >= 80 && data[i] <= 90) {
          male90.push(data[i])
        }
        if (data[i] > 90) {
          male91.push(data[i])
        }
      }
      return [male59.length, male70.length, male80.length, male90.length, male91.length]
    },
    maxmin(data) {
      var max1 = data[0];
      var max2 = data[0];
      for (var i = 1; i < data.length; i++) {
        if (max1 < data[i]) max1 = data[i]
        if (max2 > data[i]) max2 = data[i]
      }
      return { max: max1, min: max2 };
    },
    updateHandler(data) {
      /**
       * 只是这样做是无效
       * config指向的内存地址没有发生变化
       * 组件无法侦知数据变化
       */
      this.healthStatistics.series[0].data = data
      /**
       * 使用ES6拓展运算符生成新的props对象
       * 组件侦知数据变化 自动刷新状态
       */
      this.healthStatistics = { ...this.healthStatistics }
    },
    screenClick(e) {
      this.screenStyle = e;
    },
    handleChange(value) {
      console.log(value);
    },
    mapbaiduv(value) {
      this.changingIsover.push({ 'label': '当前定位' + value.cityname, 'value': '0' });
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.right-menu-item {
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  width: 2vh;
  height: 2vh;
}

.dashboard-editor-container {
  position: fixed;
  top: 0;
  left: 0;
  top: 105px;
  width: 100%;
  height: calc(100vh - 100px);
  overflow: hidden;
}

.datav-container-box {
  width: 100%;
  display: flex;

  .datav-container-left {
    width: 32%;
    height: 100%;
    position: relative;

    .datav-container-left-top {
      width: 98%;
      margin-left: 2%;
      position: relative;

      .selectDataValue {
        width: 10%;
        position: absolute;
        top: 1.55vh;
        left: 65px;
        z-index: 1;
      }

      .total-calls {
        position: absolute;
        top: 1.8vh;
        left: 28%;
        z-index: 1;
        color: #ffffff;
        font-size: 12px;
      }

      /deep/.el-input__suffix {
        right: 0;
        height: 1.5vh;
        line-height: 1.5vh;
      }

      /deep/.el-input__inner {
        height: 1.5vh;
        line-height: 1.5vh;
        padding: 0;
        text-align: center;
        text-indent: -1vh;
      }

      /deep/.el-input__icon {
        line-height: 1.5vh;
        padding: 0;
      }
    }
  }

  .datav-container-right {
    position: relative;
    width: 68%;
    height: 100.8%;
    padding-left: 0.6%;

    .cascaderDataValue {
      position: absolute;
      top: 15px;
      right: 100px;
    }

    .datav-container-right-dv-border {
      position: relative;
      width: 100%;
      overflow: hidden;
    }
  }
}

.datav-container-bottom {
  width: 100%;
  position: relative;

  .datav-box-content-bottom {
    width: 100%;
    display: flex;
    margin-top: 15px;
  }
}

.frame-item-box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .frame-item-title-li {
    position: absolute;
    top: 7%;
    left: 2%;
    z-index: 1;
    display: flex;
    align-items: center;

    & span {
      color: #ffffff;
      font-size: 14px;
      padding-left: 5px;
    }
  }

  .frame-look-over-li {
    position: absolute;
    top: 22%;
    right: 5%;
    z-index: 1;
    color: #ffffff;
    font-size: 12px;
    line-height: 1.5vh;

    .frame-look-over-i {
      margin-right: 3px;
    }
  }

  .marriage-amount-to {
    position: absolute;
    top: 8%;
    right: 8%;
    z-index: 1;
    color: #ffffff;
    font-size: 12px;
  }
}

.frame-item {
  width: 40%;
  height: 5vh;
  box-shadow: rgb(6, 46, 101) 0px 0px 25px 3px inset;
  border-radius: 8px;
}
</style>
