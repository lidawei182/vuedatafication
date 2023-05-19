import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    rihgtbar: {
      opened: Cookies.get('rihgtbarStatus')
    },
    device: 'desktop',
    language: Cookies.get('language') || 'zh',
    size: Cookies.get('size') || 'medium',
    skip: null
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    TOGGLE_SIDEBAR_PUT_AWAY: state => {
      //隐藏左侧菜单
      Cookies.set('sidebarStatus', 0)
      state.sidebar.opened = !state.sidebar.opened == true ? false : false
      state.sidebar.withoutAnimation = false
    },
    SET_RIGHTBAR: (state, opened) => {
      state.rihgtbar.opened = opened
      Cookies.set('sidebarStatus', opened)
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    },
    SET_SIZE: (state, size) => {
      state.size = size
      Cookies.set('size', size)
    },
    SET_SKIP: (state, skip) => {
      state.skip = skip
    },
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    toggleSideBarPutaway({ commit }) {
      commit('TOGGLE_SIDEBAR_PUT_AWAY')
    },
    setRightBar({ commit }, opened) {
      commit('SET_RIGHTBAR', opened)
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    setSize({ commit }, size) {
      commit('SET_SIZE', size)
    },
    setSkip({ commit }, skip) {
      commit('SET_SKIP', skip)
    }
  }
}

export default app
