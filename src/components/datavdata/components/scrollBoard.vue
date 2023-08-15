<template>
  <div>
    <dv-scroll-board 
      :config="config" 
      style="width:500px;height:250px;margin-top: 50px;" />
  </div>
</template>
<script>
export default {
  name: "ScrollBoard",
  props: {
    config: {
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

    .alert-notification-title {
      width: 30%;
      height: 50%;
      margin-top: 6%;
      padding-left: 3%;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #235fa7;
    }

    .alert-notification-ul {
      width: 65%;
      height: 80%;
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