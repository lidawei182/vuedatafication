import { constantRouterMap } from '@/router'
/* 布局*/
import Layout from '@/views/layout/Layout'
const routerMap = constantRouterMap(Layout)
const permission = {
  state: {
    routers: routerMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = routerMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const accessedRouters = data
        accessedRouters.map(function (item) {
          const item_component = item.component
          item.component = () => import(`@/views/${item_component}`)
          // 是否有子级1
          if (item.hasOwnProperty.call(item, 'children')) {
            item.children.map(function (child) {
              const child_component = child.component
              child.component = () => import(`@/views/${child_component}`)
              // 是否有第2级
              if(child.hasOwnProperty.call(child, 'children')){
                child.children.map(function(childs){
                  const childs_component = childs.component
                  childs.component = () => import(`@/views/${childs_component}`)
                })
              }
            })
          }
        })
        accessedRouters.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
