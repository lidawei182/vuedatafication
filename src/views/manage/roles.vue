<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div v-if="showSearch" class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="">
          <el-input v-model="listQuery.jdName" placeholder="名称" clearable size="small"/>
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="listQuery.status" placeholder="状态" clearable size="small">
            <el-option label="正常" value="1"/>
            <el-option label="禁用" value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-waves type="primary" icon="el-icon-search" size="small" @click="handleFilter">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-waves type="warning" icon="el-icon-refresh" size="small" @click="handleFilterClear">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作 -->
    <el-row style="margin-bottom: 10px;">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-tooltip content="刷新" placement="top">
          <el-button v-waves type="warning" icon="el-icon-refresh" circle @click="handleFilterClear"/>
        </el-tooltip>
        <el-tooltip content="添加" placement="top">
          <el-button v-waves type="success" icon="el-icon-plus" circle @click="handleCreate"/>
        </el-tooltip>
        <!-- <el-tooltip content="搜索" placement="top">
          <el-button v-waves type="primary" icon="el-icon-search" circle @click="showSearch = !showSearch"/>
        </el-tooltip> -->
        <!-- <el-tooltip content="删除" placement="top">
          <el-button v-waves :loading="deleting" :disabled="buttonDisabled" type="danger" icon="el-icon-delete" circle @click="handleDeleteAll()"/>
        </el-tooltip> -->
        <el-tooltip content="更多" placement="top">
          <el-dropdown trigger="click" placement="bottom" style="margin-left: 10px;" @command="handleCommand">
            <el-button :disabled="buttonDisabled" type="Info" circle>
              <i class="el-icon-more"/>
            </el-button>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item command="1">设为正常</el-dropdown-item>
              <el-dropdown-item command="0">设为禁用</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      stripe
      highlight-current-row
      style="width: 100%;"
      class="headercellclassname"
      :row-style="{backgroundColor: '#000e21'}"
      :cell-style="{borderColor: '#000e21'}"
      :header-cell-style="{background: '#011531',borderColor: '#000e21'}"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column label="ID" align="center" width="65" >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="100px" >
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.$index,scope.row.id)">{{ scope.row.jdName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上级" min-width="100px" >
        <template slot-scope="scope">
          <span v-if="scope.row.jdParent">{{ scope.row.jdParent }}</span>
          <span v-else>最高权限</span>
        </template>
      </el-table-column>
      <el-table-column label="级别" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jdGrade | jdGradeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110px" align="center">
        <template slot-scope="scope">
          <span :class="{'el-icon-success text-green':scope.row.status == 1,'el-icon-error text-red':scope.row.status == 0}" @click="handleModifyStatus(scope.$index,scope.row.id,scope.row.status)">{{ scope.row.status | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120px" class-name="small-padding" >
        <template slot-scope="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button v-waves type="primary" icon="el-icon-edit-outline" circle @click="handleUpdate(scope.$index,scope.row.id)"/>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button v-waves :loading="scope.row.delete" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index,scope.row.id)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.psize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <!-- 表单 -->
    <rolesForm ref="fromRoles" @updateRow="updateRow"/>
    <!-- 树 -->
    <rolesFormList ref="fromRolesList" @updateRowList="updateRowList"/>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getList, del, change, delAll, changeAll } from '@/api/roles'
import waves from '@/directive/waves'
import { pickerOptions, getArrByKey } from '@/utils'
// import { json } from 'body-parser'
import rolesForm from './roles/form'
import rolesFormList from './roles/formList'

export default {
  name: 'Roles',
  components: { rolesForm, rolesFormList},
  directives: {
    waves
  },
  computed: {
    ...mapGetters([
      'group',
    ]),
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '禁用',
        1: '正常'
      }
      return statusMap[status]
    },
    jdGradeFilter(jdGrade) {
      const jdGradeMap = {
        0: '顶级',
        1: '高级',
        2: '中级',
        3: '低级',
      }
      return jdGradeMap[jdGrade]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      selectedRows: null,
      listLoading: true,
      showSearch: false,
      listQuery: {
        page: 1,
        psize: 10,
        status: '1',
        jdName: '',
        jdParent: this.group,
      },
      buttonDisabled: true,
      deleting: false,
      pickerOptions: pickerOptions,
      currentIndex: -1
    }
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.listQuery.jdParent = this.group;
    this.fetchList()
  },
  methods: {
    fetchList() {
      this.listLoading = true
      this.listQuery.jdParent = this.group;
      getList(this.listQuery).then(response => {
        console.log(response.data.data);
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchList()
    },
    handleFilterClear() {
      this.listQuery = {
        page: 1,
        psize: 10,
        status: '1',
        jdName: '',
      }
      this.fetchList()
    },
    handleSizeChange(val) {
      this.listQuery.psize = val
      this.fetchList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchList()
    },
    handleModifyStatus(index, id, status) {
      this.list[index]['status'] = 1 - status
      change(id, 'status', 1 - status).then(response => {})
    },
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.buttonDisabled = false
      } else {
        this.buttonDisabled = true
      }
      this.selectedRows = val
    },
    handleCreate() {
      this.$refs.fromRolesList.handleCreate()
    },
    handleUpdate(index, id) {
      this.currentIndex = index
      this.$refs.fromRoles.handleUpdate(id)
    },
    updateRow(temp) {
      if (this.currentIndex >= 0 && temp.id > 0) {
        this.list.splice(this.currentIndex, 1, temp)
      } else {
        if (this.list.length >= 10) {
          this.list.pop()
        }
        this.list.push(temp)
        this.total = this.total + 1
      }
      this.currentIndex = -1
      
    },
    updateRowList(temp) {
      console.log(temp);
      // 添加后刷新
      this.handleFilterClear();
    },
    handleDelete(index, id) {
      const _this = this
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$set(_this.list[index], 'delete', true)
        del(id).then(response => {
          if (response.status === 1) {
            _this.handleFilterClear();
            _this.$notify.success(response.msg)
          } else {
            _this.$notify.error(response.msg)
          }
        }).catch(() => {

        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDeleteAll() {
      const _this = this
      if (this.selectedRows.length > 0) {
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.deleting = true
          const ids = getArrByKey(_this.selectedRows, 'id')
          const idstr = ids.join(',')
          delAll({ ids: idstr }).then(response => {
            if (response.status === 1) {
              const delindex = []
              _this.list.forEach(function(item, index, input) {
                if (ids.indexOf(item.id) > -1) {
                  delindex.push(index)
                }
              })
              for (let i = delindex.length - 1; i >= 0; i--) {
                _this.list.splice(delindex[i], 1)
              }
              _this.total = _this.total - delindex.length
              _this.$message.success(response.msg)
            } else {
              _this.$message.error(response.msg)
            }
            _this.deleting = false
          }).catch((error) => {
            _this.deleting = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        _this.$message.error('请选择要删除的数据')
      }
    },
    handleCommand(command) {
      const _this = this
      if (this.selectedRows.length > 0) {
        const ids = getArrByKey(this.selectedRows, 'id')
        const idstr = ids.join(',')
        changeAll({ val: idstr, field: 'status', value: command }).then(response => {
          if (response.status === 1) {
            _this.list.forEach(function(item, index, input) {
              if (ids.indexOf(item.id) > -1) {
                _this.list[index]['status'] = command
              }
            })
            _this.$message.success(response.msg)
          } else {
            _this.$message.error(response.msg)
          }
        }).catch((error) => {
        })
      } else {
        _this.$message.error('请选择要操作的数据')
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.headercellclassname{
  border: 0;
  color: #fff;
}
// 背景颜色
::v-deep .el-table .el-table__body tr.el-table__row td{
  background: rgba(79, 218, 255, 0.1);
}
// 表格斑马自定义颜色
::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td{
  background: rgba(0, 0, 0, 0.1);
}
.el-table::before {
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
}
::v-deep .el-table--border::after, .el-table--group::after, .el-table::before {
  background-color: #011531;
}
::v-deep .el-table__fixed-right::before{
  background-color: #011531;
}
::v-deep .el-table__fixed::before {
  background-color: #011531;
}
// 点击背景色
::v-deep .el-table__body tr.current-row > td {
  background-color: rgba(0, 0, 0, 0) !important;
  color: #fff;
}
</style>
