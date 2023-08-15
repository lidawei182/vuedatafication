<template>
  <div :class="{'hidden':!show}" class="app-right" @mousedown="move" ref="drag">
    <el-card shadow="always" body-style="{padding:'10px'}">
      <div class="header clearfix">
        <span v-text="title" />
        <el-button style="float: right; padding: 3px 0" type="text" @click="setRightBar">关闭</el-button>
      </div>
      <div class="content">
        <slot />
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "AppRight",
  props: {
    show: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["rihgtbar"])
  },
  methods: {
    setRightBar() {
      this.$store.dispatch("setRightBar", 0);
    },
    move(event) {
      let drag = this.$refs.drag;
      drag.style.cursor = "pointer";
      // 按住鼠标时为div添加一个border
      // drag.style.borderStyle = "solid";
      // drag.style.borderColor = "red";
      // drag.style.borderWidth = "3px";
      let offsetX = parseInt(drag.offsetLeft); // 获取当前的x轴距离
      let offsetY = parseInt(drag.offsetTop); // 获取当前的y轴距离
      let innerX = event.clientX - offsetX; // 获取鼠标在方块内的x轴距
      let innerY = event.clientY - offsetY; // 获取鼠标在方块内的y轴距
      // 鼠标移动的时候不停的修改div的left和top值
      document.onmousemove = function(event) {
        drag.style.left = event.clientX - innerX + "px";
        drag.style.top = event.clientY - innerY + "px";
        // 边界判断
        if (parseInt(drag.style.left) <= 0) {
          drag.style.left = "0px";
        }
        // if (parseInt(drag.style.top) <= 0) {
        //   drag.style.top = "0px";
        // }
        if (parseInt(drag.style.left) >=window.innerWidth - parseInt(drag.style.width)) {
          drag.style.left = window.innerWidth - parseInt(drag.style.width) + "px";
        }
        // if (
        //   parseInt(drag.style.top) >=
        //   window.innerHeight - parseInt(drag.style.height)
        // ) {
        //   drag.style.top =
        //     window.innerHeight - parseInt(drag.style.height) + "px";
        // }
      };
      // 鼠标抬起时，清除绑定在文档上的mousemove和mouseup事件
      // 否则鼠标抬起后还可以继续拖拽方块
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
        // 清除border
        drag.style.borderStyle = "";
        drag.style.borderColor = "";
        drag.style.borderWidth = "";
      };
    }
  }
};
</script>

<style scoped>
.app-right {
  /*84 = navbar + tags-view = 50 +34 */
  min-height: calc(100vh - 84px);
  width: 620px;
  position: fixed;
  right: 0;
  top: 84px;
  z-index: 999999999999999999;
  overflow: auto;
}
.header {
  border-bottom: 1px dotted #409eff;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.hidden {
  display: none;
}
</style>

