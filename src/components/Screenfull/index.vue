<template>
  <div>
    <svg-icon :class-name="screenfullSvg" :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" />
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'ScreenFull',
  data() {
    return {
      isFullscreen: false,
      screenfullSvg:'screenfull-svg'

    }
  },
  mounted() {
    this.init()
  },
  methods: {
    click() {
      if (!screenfull.isEnabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle();
      this.$emit('screenClick',this.isFullscreen);
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', () => {
          this.isFullscreen = screenfull.isFullscreen
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/variables.scss";
.screenfull-svg {
  color: $iconcolor;
  width: 100%;
  height: 100%;
}
</style>
