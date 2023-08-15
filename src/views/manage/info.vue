<template> 
  <div class="app-container">
    <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 100%; ">
      <el-form-item label="序列码" prop="code">
        <el-input v-model="temp.code" :disabled="true" />
      </el-form-item>
      <el-form-item label="角色" prop="groupId">
        <el-input v-model="group" :disabled="true"/>
      </el-form-item>
      <el-form-item label="账号" prop="userName">
        <el-input v-model="name" :disabled="true"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="temp.password" clearable placeholder="不修改，则留空"/>
      </el-form-item>
      <el-form-item label="头像" prop="img" v-if="temp.img.length > 0">
        <img style="width: 25%;" :src="temp.img[0]"/> 
      </el-form-item>
      <el-form-item label="标题" prop="realName">
        <el-input v-model="temp.realName" clearable/>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="temp.phone" clearable/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="temp.email" clearable/>
      </el-form-item>
    </el-form>
    <el-button :loading="btnLoading" type="primary" @click="saveData()">保存</el-button>
  </div>
</template>

<script>
import Upload from '@/components/Upload/image'
import { modify } from '@/api/admin'
import { mapGetters } from 'vuex'
import store from '@/store'
import myconfig from '@/config'
import console from 'console'

export default {
  name: 'MyInfo',
  components: { Upload },
  data() {
    return {
      btnLoading: false,
      contis:false,
      temp: {
        password: '',
        code: store.getters.code,
        realName: store.getters.realName,
        phone: store.getters.phone,
        email: store.getters.email,
        img: store.getters.avatar ? [store.getters.avatar] : []
      },
      config: {
        fileName: 'img',
        limit: 1,
        multiple: true,
        accept: 'image/*',
        action: myconfig.uploadUrl.img
      }

    }
  },
  computed: {
    ...mapGetters([
      'name',
      'group'
    ])
  },
  created() {
  },
  destroyed() {

  },
  methods: {
    bindingFormImg(){
      this.contis = true;
    },
    saveData() {
      this.btnLoading = true
      this.$refs['dataForm'].validate((valid) => {
        let data = {}
        if (valid) {
          let _this = this
          let data = {
            email: _this.temp.email,
            img: '',
            password: _this.temp.password,
            phone : _this.temp.phone,
            realName: _this.temp.realName
          }
          if(_this.temp.img.length > 0){
            data.img = _this.temp.img[0]
          }else{
            data.img = ''
          }
          modify(data).then(response => {
            if (response.status === 1) {
              _this.contis = false
              store.commit('SET_AVATAR', data.img)
              store.commit('SET_REALNAME', _this.temp.realName)
              store.commit('SET_PHONE', _this.temp.phone)
              store.commit('SET_EMAIL', _this.temp.email)
              _this.$message.success(response.msg)
              _this.$store.dispatch("setRightBar", 0)
            } else {
              _this.$message.error(response.msg)
            }
            _this.btnLoading = false
          }).catch((error) => {
            console.log(error)
            this.btnLoading = false
          })
        } else {
          this.btnLoading = false
        }
      })
    }
  }
}
</script>
