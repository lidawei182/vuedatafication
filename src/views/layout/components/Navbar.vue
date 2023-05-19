<template>
  <div class="navbar">
    <sidebar class="sidebar-container" />
    <!-- 右邊選擇 -->
    <div class="right-menu">
      
      <template v-if="device!=='mobile'">
        <error-log class="errLog-container" />
        <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
          <theme-picker />
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper" v-if="avatar">
          <img :src="avatar" onerror = "javascript:this.src = '../../../../../img/logo_ico.png'" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <div class="avatar-wrapper" v-else>
          <img src="../../../../public/img/logo_ico.png" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span style="display:block;" @click="setRightBar">{{ name }}</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </div>
    <app-right :show="rihgtbar.opened" :title="title">
      <MyInfo />
    </app-right>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ErrorLog from "@/components/ErrorLog";
import ThemePicker from "@/components/ThemePicker";
import AppRight from "./AppRight";
import Sidebar from "./Sidebar";
import MyInfo from "@/views/manage/info";

export default {
  name: 'bavBar',
  components: {
    ErrorLog,
    ThemePicker,
    AppRight,
    Sidebar,
    MyInfo
  },
  data() {
    return {
      title: "个人资料"
    };
  },
  computed: {
    ...mapGetters(["sidebar", "rihgtbar", "name", "avatar", "device"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("toggleSideBar");
    },
    logout() {
      this.$store.dispatch("FedLogOut").then(() => {
        location.reload(); // In order to re-instantiate the vue-router object to avoid bugs
      });
    },
    setRightBar() {
      this.$store.dispatch("setRightBar", 1);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/variables.scss";
// 设置右边按钮
.el-color-picker--medium{
  position: relative !important;
  top: -12px !important;
}
.el-color-picker__trigger {
  margin-top: 0 !important;
}
.navbar {
  height: 80px;
  .hamburger-container {
    line-height: 46px;
    float: left;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    position: absolute;
    top: 26px;
    right: 10px;
    z-index: 999999999999999;
    display: flex;
    align-items: center;
    justify-content: right;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 5px;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .el-color-picker__trigger{
          margin: 0 !important;
        }
        .user-avatar {
          cursor: pointer;
          width: 34px;
          height: 34px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -15px;
          top: 12px;
          font-size: 12px;
          color: $iconcolor;
        }
      }
    }
  }
}
</style>
