<template>
  <div class="alert-notification-container">

    <span class="alert-notification-title">{{ alertInformationData.oldmanname }}</span>

    <ul class="alert-notification-ul"
      v-if="alertInformationData.oldmanname != '无报警通知'">
      <li>
        <span v-if="alertInformationData.Address">地址 ：</span>{{ alertInformationData.Address }}
      </li>
      <li>
        <div class="alert-notification-date">
          <div class="calltime-police">
            <span>警报 ：</span>
            <span>{{ alertInformationData.calltime | calltimeFilter }}</span>
          </div>
        </div>
      </li>
      <li class="alert-notification-below">
        <div class="alert-notification-processed"
          style="color: #22eb47;" 
          v-if="alertInformationData.status == '呼叫' && alertInformationData.calltime && alertInformationData.taketime">
          {{ alertInformationData.status }}中
        </div>
        <div class="alert-notification-processed" 
          style="color: #22eb47;" 
          v-else-if="alertInformationData.status == '呼叫' && alertInformationData.calltime">
          {{ alertInformationData.status }}
        </div>
        <div class="alert-notification-processed" 
          style="color: #22eb47;" 
          v-else-if="alertInformationData.status == '拉绳' && alertInformationData.calltime && alertInformationData.taketime">
          {{ alertInformationData.status }}中
        </div>
        <div class="alert-notification-processed" 
          style="color: #22eb47;" 
          v-else-if="alertInformationData.status == '拉绳' && alertInformationData.calltime">
          {{ alertInformationData.status }}
        </div>
        <div v-else-if="alertInformationData.status == '挂断' 
          && alertInformationData.taketime == null || alertInformationData.endtime == null
          && alertInformationData.taketime == '' || alertInformationData.endtime == ''
          " class="alert-notification-processed">
          异常挂断
        </div>
        <div class="alert-notification-processed" v-else>
          {{ alertInformationData.status }}
        </div>
      </li>
    </ul>
    <div v-else>
      <dv-decoration-4 :reverse="true" style="width:10vh;height:1vh; margin-left: 2vh;" />
    </div>

  </div>
</template>
<script>
export default {
  name: "AlertInformation",
  filters: {
    calltimeFilter(e) {
      let res = e;
      if(res){
        res = e.slice(-8);
      }else{
        res = '';
      }
      return res;
    }
  },
  props: {
    alertInformationData: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  mounted() {

  },
  methods: {}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.frame-item-container {
  .alert-notification-container {
    height: 100%;
    color: #ffffff;
    display: flex;
    align-items: center;
    .alert-notification-title {
      width: 30%;
      height: 50%;
      padding-left: 3%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #235fa7;
      font-size: 12px;
    }

    .alert-notification-ul {
      width: 65%;
      list-style: none;
      padding-left: 3%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 0.8vh;
      & li {
        -webkit-line-clamp: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 16px;
      }

      .alert-notification-below {
        display: flex;

        .alert-notification-processed {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #cfd0d0;
        }

        .alert-notification-date {
          line-height: 18px;
        }
      }
    }
  }
}
</style>