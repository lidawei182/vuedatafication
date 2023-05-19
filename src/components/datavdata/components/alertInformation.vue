<template>
  <div class="alert-notification-container">

    <span class="alert-notification-title">{{ alertInformationData.oldmanname }}</span>

    <ul class="alert-notification-ul" v-if="alertInformationData.oldmanname != '无报警通知'">
      <li>{{ alertInformationData.Address }}</li>
      <li class="alert-notification-below">
        <div class="alert-notification-processed" 
          v-if=" alertInformationData.status == '挂断' &&
            alertInformationData.taketime == ' ' ||
            alertInformationData.taketime == null &&
            alertInformationData.endtime == null ||
            alertInformationData.endtime == ''
          ">
          异常挂断
        </div>
        <div class="alert-notification-processed" v-else>
          {{ alertInformationData.status }}
        </div>
        <div class="alert-notification-date">
          <div>警报：{{ alertInformationData.calltime }}</div>
          <div v-if="alertInformationData.taketime == ' ' || alertInformationData.taketime == null">
            处理
          </div>
          <div v-else>处理：{{ alertInformationData.taketime }}</div>
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
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #235fa7;
    }

    .alert-notification-ul {
      width: 65%;
      list-style: none;
      padding-left: 3%;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      & li {
        padding: 2px 0;
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
          width: 30%;
          display: flex;
          align-items: center;
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