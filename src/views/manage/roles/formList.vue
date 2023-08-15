<template>
  <div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form 
        ref="dataForm" 
        :rules="rules" 
        :model="temp" 
        label-position="left" 
        label-width="100px" 
        style="width: 100%; height: 50vh;overflow-y: scroll;">
     
        <el-table
          :data="tableData"
          style="width: 100%;
          margin-bottom: 20px;"
          row-key="id"
          border
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column
            prop="jdName"
            label="名称"
            width="320">
            <template slot-scope="scope">
              <el-row type="flex" align="middle">
                <el-col :span="2" class="line-el-col-expand" v-if="scope.row.jdGrade > 1">
                  <span class="line-el-col-expand-top"></span>
                  <span class="line-el-col-expand-conter"></span>
                </el-col>
                <el-col :span="4" v-if="scope.row.jdGrade < 3">
                  <el-button 
                  size="mini"
                  type="primary"
                  circle
                  @click="buttonReset(scope.row)"
                  icon="el-icon-plus"/>
                </el-col>
                <el-col :span="18" v-if="scope.row.jdGrade == 0 || scope.row.is">
                  <el-input
                    v-model="scope.row.jdName"
                    style="width:100%"
                    :disabled="true"
                  />
                </el-col>
                <el-col :span="18" v-else>
                  <el-input
                    v-model="scope.row.jdName"
                    style="width:100%"
                    :controls="false"
                    @blur.capture.native="addblur(scope.row)"
                  />
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="jdParent"
            label="上级">
          </el-table-column>
          <el-table-column
            prop="rules"
            label="权限">
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template slot-scope="scope" v-if="scope.row.jdGrade !=0">
              <el-button
                size="mini"
                @click="handleEdit(scope.row)">权限</el-button>
              <el-button
                v-if="scope.row.is != true"
                size="mini"
                @click="updatascope(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog title="页面权限" :visible.sync="dialogVisibletree" :append-to-body="true">

          <el-form-item label="名称" prop="title">
            <el-input v-model="temp.title" clearable/>
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
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibletree = false">取消</el-button>
            <el-button :loading="btnLoading" type="primary" @click="saveDataTree()">确定</el-button>
          </div>
        </el-dialog>

      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="saveData()">保存</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getListAll } from '@/api/rules'
import { getinfoList, saveList } from '@/api/roles'
import tree from '@/utils/tree'
import { randomLenNum } from '@/utils/util'

export default {
  name: 'RolesFormList',
  data() {
    return {
      btnLoading: false,
      ruleList: [],
      temp: {
        id: 0,
        jdName: '',
        status: 1,
        rules: ''
      },
      dialogFormVisible: false,
      dialogVisibletree: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
      },
      defaultChecked: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      rowkey:0,
      tableobj:{},
      tableData: [],
    }
  },
  computed: {
    ...mapGetters([
      'group',
      'code'
    ]),
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
  mounted() {

  },
  destroyed() {
  },
  methods: {
    addblur(e){
      if(e.jdName == ''){return false;}
      let tableData = this.tableData[0].children;
      if(e.jdGrade == 1){
        this.addalertaddblur(tableData);
      }else if(e.jdGrade == 2 || e.jdGrade == 3){
        for(let i = 0; tableData.length > i; i++){
          if(e.jdParent == tableData[i].jdName){
            let ir2 = this.isRepeat(tableData[i].children);
            if(ir2.is){
              this.$alert('名称不能重复', '提示', {
                confirmButtonText: '确定',
              });
              tableData[i].children[ir2.index].jdName = '';
              this.tableData[0].children = JSON.parse(JSON.stringify(tableData));
            }
          }
          if(e.jdGrade == 3){
            for(let j = 0; tableData[i].children.length > j; j++){
              if(e.jdParent == tableData[i].children[j].jdName){
                let ir3 = this.isRepeat(tableData[i].children[j].children);
                if(ir3.is){
                  this.$alert('名称不能重复', '提示', {
                    confirmButtonText: '确定',
                  });
                  tableData[i].children[j].children[ir3.index].jdName = '';
                  this.tableData[0].children = JSON.parse(JSON.stringify(tableData));
                }
              }
            }
          }
        }
      }
    },
    addalertaddblur(data){
      let ir = this.isRepeat(data);
        if(ir.is){
          this.$alert('名称不能重复', '提示', {
            confirmButtonText: '确定',
          });
          data[ir.index].jdName = '';
          this.tableData[0].children = JSON.parse(JSON.stringify(data));
        }
    },
    isRepeat(arr){
      let hash = {};
      let datais = {
        index: null,
        is: true
      };
      for(let i=0;i<arr.length;i++){
        if (!hash[arr[i].jdName]) {
          hash[arr[i].jdName] = true;
        }else{
          datais.index = i;
        }
      }
      if(Object.keys(hash).length<arr.length){
        datais.is = true
      }else{
        datais.is = false
      }
      return datais;
    },
    updatascope(row){
      // 删除
      let tableData = this.tableData[0].children;
      // 父级 -》 根据级别找到层 -》 name -》下标
      for(let n = 0; tableData.length > n; n++){
        // 第一层
        if(tableData[n].jdName == row.jdName && tableData[n].jdParent == row.jdParent){
          tableData.splice(n,1);
        }else{
          if(tableData[n].children){
            // 第二层
            for(let i = 0; tableData[n].children.length > i; i++){
              if(tableData[n].children[i].jdName == row.jdName && tableData[n].children[i].jdParent == row.jdParent){
                tableData[n].children.splice(i,1);
              }else{
                if(tableData[n].children[i].children){
                  // 第三层
                  for(let j = 0; tableData[n].children[i].children.length > j; j++){
                    if(tableData[n].children[i].children[j].jdName == row.jdName && tableData[n].children[i].children[j].jdParent == row.jdParent){
                      tableData[n].children[i].children.splice(j,1);
                    }
                  }
                }else{
                  tableData[n].children[i].children = [];
                }
              }
            }
          }else{
            tableData[n].children = [];
          }
        }
      }
      this.tableData[0].children = JSON.parse(JSON.stringify(tableData));
    },
    saveDataTree(){
      // 数据整合
      let data_integration = {
        jdGrade: this.tableobj.jdGrade,
        jdName: this.tableobj.jdName,
        jdParent: this.tableobj.jdParent,
        rules: this.temp.rules,
        status: this.temp.status,
      };
      this.saveDataTreeadd(data_integration);
      this.dialogVisibletree = false;
    },
    saveDataTreeadd(data){
      let tableDataval = this.tableData[0].children;
      for(let n = 0; tableDataval.length > n; n++){
        if(tableDataval[n].jdGrade == data.jdGrade && tableDataval[n].jdName == data.jdName && tableDataval[n].jdParent == data.jdParent){
          tableDataval[n].rules = data.rules;
          tableDataval[n].status = data.status;
        }
        if(data.jdGrade == 2 || data.jdGrade == 3){
          if(tableDataval[n].children){
            for(let i = 0; tableDataval[n].children.length > i; i++){
              if(tableDataval[n].children[i].jdGrade == data.jdGrade && tableDataval[n].children[i].jdName == data.jdName && tableDataval[n].children[i].jdParent == data.jdParent){
                tableDataval[n].children[i].rules = data.rules;
                tableDataval[n].children[i].status = data.status;
              }
              if(data.jdGrade == 3){
                if(tableDataval[n].children[i].children){
                  for(let j = 0; tableDataval[n].children[i].children.length > j; j++){
                    if(tableDataval[n].children[i].children[j].jdGrade == data.jdGrade && tableDataval[n].children[i].children[j].jdName == data.jdName && tableDataval[n].children[i].children[j].jdParent == data.jdParent){
                      tableDataval[n].children[i].children[j].rules = data.rules;
                      tableDataval[n].children[i].children[j].status = data.status;
                    }
                  }
                }
              }
            }
          }
        }
      }
      this.tableData[0].children = JSON.parse(JSON.stringify(tableDataval));
    },
    handleEdit(row){
      // 显示权限编辑
      if(this.$refs.tree){
        this.$refs.tree.setCheckedKeys([]);
      }
      this.dialogVisibletree = !this.dialogVisibletree;
      this.tableobj = {};
      this.tableobj = row;
      this.temp.title = row.jdName;
      if(row.rules){
        let rules = row.rules.split(",");
        this.$nextTick(() => {
          if(this.$refs.tree){
            this.$refs.tree.setCheckedKeys(rules);
          };
        });
      }
    },
    buttonReset(e){
      return false;
      if(e.jdName == ''){
        this.$alert('名称不能为空', '提示', {
          confirmButtonText: '确定',
        });
        return false;
      }
      // 添加管理员按钮
      // 根据管理员名称创建下级
      let b_a = {}, id = 0, datachildren = {};
      b_a = this.tableData;
      id = randomLenNum(10,Date.now()) + this.rowkey ++;
      id = id + this.group;
      for(let n = 0; b_a.length > n; n++){
        if(e.jdGrade == 0){
          datachildren = {};
          datachildren = {id:id, jdName:'',rules:'', jdGrade:b_a[n].jdGrade+1, jdParent:b_a[n].jdName,children:[],is:false};
          b_a[n].children.push(datachildren);
        }
        // 判断等级
        for(let i = 0; b_a[n].children.length > i; i++){
          if(b_a[n].children[i].jdName == e.jdName && e.jdGrade == 1){
            datachildren = {};
            datachildren = {id:id, jdName:'', rules:'',jdGrade:b_a[n].children[i].jdGrade+1, jdParent:b_a[n].children[i].jdName,children:[],is:false};
            if(b_a[n].children[i].children.length > 0){
              b_a[n].children[i].children.push(datachildren);
            }else{
              b_a[n].children[i].children = [datachildren];
            }
          }
          if(e.jdGrade == 2){
            if(!e.jdName){
              this.$alert('请填写名称', '提示', {
                confirmButtonText: '确定',
              });
              return false;
            }
            if(b_a[n].children[i].children){
              for(let j = 0; b_a[n].children[i].children.length > j; j++){
                if(b_a[n].children[i].children[j].jdName == e.jdName){
                  datachildren = {};
                  datachildren = {id:id, jdName:'', rules:'',jdGrade:b_a[n].children[i].children[j].jdGrade+1, jdParent:b_a[n].children[i].children[j].jdName,children:[],is:false};
                  if(b_a[n].children[i].children[j].children.length > 0){
                    b_a[n].children[i].children[j].children.push(datachildren);
                  }else{
                    b_a[n].children[i].children[j].children = [datachildren];
                  }
                }
              }
            }else{
              b_a[n].children[i].children = [];
            }
          }
        }

      }
      this.tableData = JSON.parse(JSON.stringify(b_a));
    },
    getRules() {
      getListAll().then(response => {
        this.ruleList = response.data
      })
    },
    resetTemp() {
      this.temp = {
        id: 0,
        jdName: '',
        jdParent: '',
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
    handleCreate() {
      // 父级使用进入后调用显示树
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.currentIndex = -1;
      if(this.$refs.tree){
        this.$refs.tree.setCheckedKeys([]);
      }
      this.getinfoListdData(this.group);
    },
    getinfoListdData(name) {
      let that = this;
      getinfoList(name).then(response => {
        if(response.status == 1){
          let data = response.data;
          let array = [];
          for(let n = 0; data.length > n; n++){
            // 第一层
            if(data[n].jdGrade == 1){
              data[n].children = [];
              data[n].is = true;
              array.push(data[n]);
            }
            // 第二层赋值
            if(data[n].jdGrade == 2 || data[n].jdGrade == 3){
              for(let i = 0; array.length > i; i++){
                if(array[i].jdName == data[n].jdParent){
                  data[n].children = [];
                  data[n].is = true;
                  array[i].children.push(data[n]);
                }
                // 第三层赋值
                if(data[n].jdGrade == 3){
                  for(let j = 0; array[i].children.length > j; j++){
                    if(array[i].children[j].jdName == data[n].jdParent){
                      data[n].children = [];
                      data[n].is = true;
                      array[i].children[j].children.push(data[n]);
                    }
                  }
                }
              }
            }
          }
          let tableDataval = array;
          let tableClone = that.clone(tableDataval);
          that.tableData = [{id:0,jdName:that.group,rules:'',jdGrade:0,jdParent: '顶级',children:tableClone}];
        }
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    clone(e){
      let that = this;
      for(let n = 0; e.length > n; n++){
        if(e[n].jdGrade == 1){
          if(!( 'children' in e[n])){
            e[n].children = new Array();
            
          }
        }else if(e[n].jdGrade == 2){
          if(!( 'children' in e[n])){
            e[n].children = new Array();
          }
        }else if(e[n].jdGrade == 3){
          if(!( 'children' in e[n])){
            e[n].children = new Array();
          }
        };
        if(( 'children' in e[n])){
          that.clone(e[n].children);
        }
      }
      return e;
    },
    flatten(arr){
      let that = this;
      if(arr){
        return [].concat(...arr.map(item => [].concat(item,...that.flatten(item.children))))
      }else{
        return arr
      }	    
    },
    saveData() {
      this.dialogFormVisible = false
      return false;
      this.btnLoading = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const _this = this
          if(_this.tableData.length == 0){
            _this.dialogFormVisible = false
            return false
          }
          const data_name = _this.tableData[0].children;
          let data_name_flatten =  _this.flatten(data_name);
          const d = { data: JSON.stringify(data_name_flatten) };
          saveList(d).then(response => {
            if (response.status === 1) {
              if (!d.id) {
                d.id = response.data.id
              }
              this.$emit('updateRowList', d)
              _this.dialogFormVisible = false
              _this.$message.success(response.msg)
            } else {
              _this.$message.error(response.msg)
            }
            _this.btnLoading = false
          }).catch(() => {
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
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-table--border::after, .el-table--group::after, .el-table::before {
  background-color: #DCDFE6;
}
::v-deep .el-table .cell{
  display: flex;
  align-items: center;
}
.line-el-col-expand{
  position: relative;
  .line-el-col-expand-top{
    width: 1px;
    height: 15px;
    background-color: rgba(0,0,0,0.2);
    position: absolute;
    top: -15px;
    left: 0;
  }
  .line-el-col-expand-conter{
    width: 10px;
    height: 1px;
    background-color: rgba(0,0,0,0.2);
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>