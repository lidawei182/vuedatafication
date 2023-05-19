<template>
  <el-container :style="autoHeight">
    <el-menu
      :collapse="isCollapse"
      style="border: 0; padding: 20px 30px 0 0;"
      :default-active="$route.path" 
      background-color="#011531"
      text-color="#bfcbd9"
      active-text-color="#ffffff">
      <template v-for="(item,index) in navList">
        <el-submenu :key="index" :index="item.path" @click.native="openMenus(item)">
          <template slot="title">
             <item
              :icon="item.meta.icon"
              :title="generateTitle(item.meta.title)" />
          </template>
        </el-submenu>
      </template>
    </el-menu>
    <el-container>
      <!-- 头部 -->
      <el-header>
        <!-- 麵包卷 -->
        <breadcrumb class="breadcrumb-container" />
      </el-header>
      <!-- 身体 -->
      <el-main>
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="cachedViews">
            <router-view :key="key" />
          </keep-alive>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import { validatenull } from "@/utils/validate";
import { generateTitle } from "@/utils/i18n";
import Item from "../layout/components/Sidebar/Item.vue";
let windowHeight = parseInt(window.innerHeight);
export default {
  name: "Index",
  components: { Item, Breadcrumb },
  data() {
    return {
      navList: [],
      isCollapse: false,
      windowHeight: windowHeight,
      autoHeight: {
        height: ''
      },
    };
  },
  computed: {
    ...mapGetters(["permission_routers"]),
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.fullPath;
    }
  },
  watch: {
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },
  destroyed() {},
  mounted() {
    this.getMenus();
  },
  destroyed() {
    window.removeEventListener('resize', this.getHeight)
  },
  methods: {
    generateTitle,
    getHeight() {
        this.autoHeight.height = (windowHeight - 110) + 'px';
    },
    getMenus() {
      // 显示子级导航
      let strPath = this.$route.path.split('/');
      strPath = '/'+strPath[1];
      const pr = this.permission_routers;
      for(let i = 0; pr.length > i; i++){
        if(pr[i].name && pr[i].redirect != '/404' && pr[i].path == strPath){
          pr[i].children.forEach(element => {
            this.navList = element.children;
          });
        }
      }   
    },
    openMenus(item = {}) {
      //当点击顶部菜单做的事件
      if (!validatenull(item)) {
        // this.$store.dispatch("setTopActiveInxdeChildren", item.path);
        //vue-router路由
        this.$router.push(item.path);
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .breadcrumb-container{
    position: relative;
    top: 22px;
  }
</style>