<template>
  <div style="display:inline-block;">
    <label class="radio-label" style="padding-left:0;color: #C0C4CC;font-size: 14px;">文件名称&nbsp;:&nbsp;</label>
    <el-input v-model="filename" placeholder="请输入文件名称" style="width:200px;" prefix-icon="el-icon-document" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    filename: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
