<template>
  <el-dialog 
    :title="textMap[dialogStatus]"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 100%; height: 50vh;overflow-y: scroll;">
      <!-- <el-form-item label="角色" prop="groupId">
        <el-select v-model="temp.groupId" class="filter-item" placeholder="请选择">
          <el-option v-for="item in roles" :key="item.id" :label="item.title" :value="item.id" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="账号" prop="userName">
        <el-input v-model="temp.userName" clearable/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="temp.password" clearable/>
      </el-form-item>
      <el-form-item label="头像" prop="img">
        <Upload v-model="temp.img" :config="config" :UnitNo="code" @input="bindingFormImg($event)" />
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
      <el-form-item label="状态">
        <el-radio-group v-model="temp.isEnabled">
          <el-radio :label="1">正常</el-radio>
          <!-- <el-radio :label="0">禁用</el-radio> -->
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="saveData()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Upload from '@/components/Upload/image'
import { getListAll } from '@/api/roles'
import { getinfo, save } from '@/api/admin'
import { delfile } from '@/api/login'
import { formatImgToArr, getNowTime } from '@/utils'
import { validatePhone, validateEmail } from '@/utils/validate'
import myconfig from '@/config'
import { mapGetters } from 'vuex'

export default {
  name: 'AdminForm',
  components: { Upload },
  computed: {
    ...mapGetters([
      'code'
    ])
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (validatePhone(value)) {
        callback()
      } else {
        return callback(new Error())
      }
    }
    var checkEmail = (rule, value, callback) => {
      if (validateEmail(value)) {
        callback()
      } else {
        return callback(new Error())
      }
    }
    return {
      btnLoading: false,
      roles: {},
      contid: '',
      contis: false,
      temp: {
        id: 0,
        userName: '',
        password: '',
        realName: '',
        isEnabled: 1,
        phone: '',
        email: '',
        regTime: getNowTime(),
        img: []
      },
      config: {
        fileName: 'img',
        limit: 1,
        multiple: true,
        accept: 'image/*',
        action: myconfig.uploadUrl.img
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
        userName: [{ required: true, message: '账号必填', trigger: 'blur' }],
        phone: [{ validator: checkPhone, message: '手机号格式错误', trigger: 'blur' }],
        email: [{ validator: checkEmail, message: '邮箱格式错误', trigger: 'blur' }]
      }

    }
  },
  watch: {
    dialogFormVisible: function() {
      console.log(this.contis)
      let that = this
      if(this.contis){
        if(this.temp.img.length > 0){
          let data = { img: this.temp.img[0] ,UnitNo : this.code };
          delfile(data).then(response => {
            if(response.data.unlink){
              that.$router.go(0)
            }
          })
        }
      }
      this.resetTemp()
    },
    temp: {
      handler() {},
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getRoles()
  },
  destroyed() {

  },
  methods: {
    bindingFormImg(e){
      let that = this;
      getinfo(this.contid).then(response => {
        if (response.status === 1) {
          if(response.data.img == e){
            that.contis = false;
          }else{
            that.contis = true;
          }
        }
      })     
    },
    getRoles() {
      getListAll().then(response => {
        this.roles = response.data
      })
    },
    resetTemp() {
      this.temp = {
        id: 0,
        userName: '',
        password: '',
        realName: '',
        isEnabled: 1,
        phone: '',
        email: '',
        regTime: getNowTime(),
        img: []
      }
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.currentIndex = -1
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(id) {
      this.contid = id;
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      const _this = this
      getinfo(id).then(response => {
        if (response.status === 1) {
          _this.temp.id = response.data.id
          _this.temp.userName = response.data.userName
          _this.temp.realName = response.data.realName
          _this.temp.isEnabled = response.data.isEnabled
          _this.temp.phone = response.data.phone
          _this.temp.email = response.data.email
          _this.temp.password = ''
          _this.temp.img = formatImgToArr(response.data.img)
        }
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    saveData() {
      this.btnLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let _this = this
          let data = {
            id: _this.temp.id,
            userName: _this.temp.userName,
            password: _this.temp.password,
            realName: _this.temp.realName,
            isEnabled: _this.temp.isEnabled,
            phone: _this.temp.phone,
            email: _this.temp.email,
            regTime: _this.temp.regTime,
            img: ''
          }
          if(_this.temp.img.length > 0){
            data.img = _this.temp.img[0]
          }else{
            data.img = ''
          }
          save(data).then(response => {
            if (response.status === 1) {
              if (!data.id) {
                data.id = response.data.id
              }
              _this.contis = false;
              // todo
              this.$emit('updateRow', data)
              _this.dialogFormVisible = false
              _this.$message.success(response.msg)
              _this.$router.go(0)
            } else {
              _this.$message.error(response.msg)
            }
            _this.btnLoading = false
          }).catch((error) => {
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
