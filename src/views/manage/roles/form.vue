<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 100%; height: 50vh;overflow-y: scroll;">
      <el-form-item label="名称" prop="jdName">
        <el-input v-model="temp.jdName" clearable/>
      </el-form-item>
      <el-form-item label="上级" prop="jdParent">
        <el-input v-model="temp.jdParent" :disabled="true"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="temp.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="权限">
        <el-tree
          ref="tree"
          :data="getRulesList"
          :default-checked-keys="defaultChecked"
          :props="defaultProps"
          default-expand-all
          show-checkbox
          check-strictly
          node-key="id"
          @check="checkHandle"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="saveData()">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getListAll } from '@/api/rules'
import { getinfo, save } from '@/api/roles'
import tree from '@/utils/tree'

export default {
  name: 'RolesForm',
  data() {
    return {
      btnLoading: false,
      ruleList: [],
      temp: {
        id: 0,
        jdName: '',
        jdParent:'',
        jdGrade: 1,
        status: 1,
        rules: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
        jdName: [{ required: true, message: '名称必填', trigger: 'blur' }]
      },
      defaultChecked: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }

    }
  },
  computed: {
    getRulesList() {
      return tree.listToTreeMulti(this.ruleList)
    }
  },
  watch: {
    dialogFormVisible: function() {
      this.resetTemp()
    }
  },
  created() {
    this.getRules()
  },
  destroyed() {
  },
  methods: {
    getRules() {
      getListAll().then(response => {
        this.ruleList = response.data
      })
    },
    resetTemp() {
      this.temp = {
        id: 0,
        jdName: '',
        jdParent:'',
        jdGrade: 1,
        status: 1,
        rules: ''
      }
    },
    checkHandle(data) {
      const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys().join(',')
      const checkedKeys = this.$refs.tree.getCheckedKeys().join(',')
      if (halfCheckedKeys.length && checkedKeys.length) {
        this.temp.rules = halfCheckedKeys + ',' + checkedKeys
      } else if (halfCheckedKeys.length && checkedKeys.length === 0) {
        this.temp.rules = halfCheckedKeys
      } else if (halfCheckedKeys.length === 0 && checkedKeys.length) {
        this.temp.rules = checkedKeys
      } else {
        this.temp.rules = ''
      }
    },
    handleUpdate(id) {
      // 显示用户信息 使用父级方法
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      const _this = this
      getinfo(id).then(response => {
        if (response.status === 1) {
          _this.temp.id = response.data.id
          _this.temp.jdName = response.data.jdName
          _this.temp.jdParent = response.data.jdParent
          _this.temp.jdGrade = response.data.jdGrade
          _this.temp.status = response.data.status
          _this.temp.rules = response.data.rules
          this.$refs.tree.setCheckedKeys(_this.temp.rules.split(','))
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
          const _this = this
          const d = this.temp
          save(d).then(response => {
            if (response.status === 1) {
              if (!d.id) {
                d.id = response.data.id
              }
              this.$emit('updateRow', d)
              _this.dialogFormVisible = false
              _this.$message.success(response.msg)
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