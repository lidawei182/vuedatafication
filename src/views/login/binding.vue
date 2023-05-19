<template>
  <div 
    :class="{'binding-hidden':!show}" 
    class="binding-right"
    :style="{width:wb+'%', height:hb+'px'}" 
    ref="drag">
    <el-card shadow="always" body-style="{padding:'10px'}">
      <div class="binding-header binding-clearfix">
        <span v-text="title" @mousedown="move" />
        <el-button style="float: right; padding: 3px 0" type="text" @click="setBindingBar">关闭</el-button>
      </div>
    </el-card>
    <slot />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "BindingIndex",
  props: {
    show: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ""
    },
    wb: {
      type: Number,
      default: 310
    },
    hb: {
      type: Number,
      default: 155
    }
  },
  data() {
    return {
      bindingShow: true
    };
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    setBindingBar() {
      this.$emit("showBindingBar",false);
    },
    move(event) {
      let drag = this.$refs.drag;
      drag.style.cursor = "pointer";
      // 按住鼠标时为div添加一个border
      drag.style.borderStyle = "solid";
      drag.style.borderColor = "red";
      drag.style.borderWidth = "3px";
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
        if (parseInt(drag.style.left) >=window.innerWidth - parseInt(drag.style.width)) {
          drag.style.left = window.innerWidth - parseInt(drag.style.width) + "px";
        }
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

<style lang="scss" scoped>
.binding-right {
  background-color: #fff;
  position: fixed;
  top: 50%;
  left: 50%;
  margin: 0;
  padding: 0;
  transform: translate(-50%, -50%); /*水平居中*/
  z-index: 999;
  overflow: auto;
  border-radius: 8px;
}
.binding-header {
  border-bottom: 1px dotted #409eff;
}
.binding-clearfix:before,
.binding-clearfix:after {
  display: table;
  content: "";
}
.binding-clearfix:after {
  clear: both;
}
.binding-hidden {
  display: none;
}
</style>

