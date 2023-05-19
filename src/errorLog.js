import Vue from 'vue'
import store from './store'
if (process.env.NODE_ENV === 'production') {
  Vue.config.errorHandler = function (err, vm, info) {
    Vue.nextTick(() => {
      store.dispatch('addErrorLog', {
        err,
        vm,
        info,
        url: window.location.href
      })
      console.error(err, info)
    })
  }
}
//onerror方法无法捕获Vue组件信息
// err: 具体错误信息
// vm: 当前错误所在的Vue实例
// info: 错误所在的生命周期钩子
