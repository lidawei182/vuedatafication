<template>
  <div>
    <el-form 
      :model="bindingForm" 
      status-icon 
      :rules="bindingrules" 
      ref="bindingForm" 
      label-width="100px" >
      <el-form-item label="账号名称" prop="userName">
        <el-input v-model="bindingForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="img">
        <Upload v-model="bindingForm.img" :config="config" @input="bindingFormImg($event)" @dataurl="dataurl"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="bindingForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="bindingForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="序列码" prop="UnitNo">
        <el-input v-model="bindingForm.UnitNo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('bindingForm')">提交</el-button>
        <el-button @click="resetForm('bindingForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Upload from '@/components/Upload/image';
import { getNowTime } from '@/utils';
import myconfig from '@/config';
import { mapGetters } from "vuex";
import { saveLogin, delfile } from '@/api/login'
export default {
  name: "bindingForm",
  props: {
    delfileName: {
      type: String,
      default: '0'
    }
  },
  components: { Upload },
  watch:{
    delfileName:{
      handler:function(val){
        if(val == '1'){
          this.bindingForm.img = [];
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    var validateUnitNo = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入序列码'));
      } else {
        callback();
      }
    };
    
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号名称'));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.bindingForm.checkPass !== '') {
          this.$refs.bindingForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.bindingForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      config: {
        fileName: 'img',
        limit: 1,
        multiple: true,
        accept: 'image/*',
        action: myconfig.uploadUrl.img
      },
      bindingForm: {
        id: 0,
        userName: '',
        realName: '核心',
        password: '',
        isEnabled: 1,
        phone: '',
        email: '',
        regTime: getNowTime(),
        img: [],
        checkPass: '',
        UnitNo: ''
      },
      bindingrules:{
        userName: [
          { validator: validateName, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        UnitNo: [
          { validator: validateUnitNo, trigger: 'blur' }
        ]
      },
    };
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    bindingFormImg(e){
      this.bindingForm.img = e;
    },
    dataurl(e){
      this.$emit('bindingDataurl',e);
    },
    submitForm(bindingForm) {
      let _this = this;
      this.$refs[bindingForm].validate((valid) => {
        if (valid) {
          this.$emit('bindingSubmit','')
          let data = {
            UnitNo: _this.bindingForm.UnitNo,
            checkPass: _this.bindingForm.checkPass,
            email: _this.bindingForm.email,
            id: _this.bindingForm.id,
            img: '',
            isEnabled: _this.bindingForm.isEnabled,
            password: _this.bindingForm.password,
            phone: _this.bindingForm.phone,
            realName: _this.bindingForm.realName,
            regTime: _this.bindingForm.regTime,
            userName: _this.bindingForm.userName
          }
          if(_this.bindingForm.img.length > 0){
            data.img = _this.bindingForm.img[0]
          }else{
            data.img = ''
          }
          saveLogin(data).then(response => {
            if (response.status === 1) {
              console.log(response)
              _this.$message.success(response.msg);
            } else {
              _this.$alert(response.msg, '注意！', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$message({
                    type: 'info',
                    message: `action: ${ action }`
                  });
                }
              });
            }
          })
          .catch(error => {
            console.log(error);
            if(this.bindingForm.img.length > 0){
              let data = { img: this.bindingForm.img[0] };
              delfile(data).then(response => {
                if(response.data.unlink){
                  _this.bindingForm.img = [];
                }
              })
            }
          });
        } else {
          return false;
        }
      });
    },
    resetForm(bindingForm) {
      if(this.bindingForm.img.length > 0){
        let data = { img: this.bindingForm.img[0] };
        let that = this;
        delfile(data).then(response => {
          if(response.data.unlink){
            that.$message({
              message: response.msg, 
              type: 'success'
            });
            this.$emit('bindingDataurl','');
            this.$refs[bindingForm].resetFields();
          }else{
            that.$message({
              message: response.msg,
              type: 'warning'
            });
            this.$refs[bindingForm].resetFields();
          }
        })
      }else{
        this.$refs[bindingForm].resetFields();
      }
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

