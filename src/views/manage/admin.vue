<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div v-if="showSearch" class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label>
          <el-input v-model="listQuery.userName" placeholder="账号" clearable size="small" />
        </el-form-item>
        <el-form-item label>
          <el-input v-model="listQuery.phone" placeholder="手机号" clearable size="small" />
        </el-form-item>
        <el-form-item label>
          <el-input v-model="listQuery.realName" placeholder="姓名" clearable size="small" />
        </el-form-item>
        <el-form-item label>
          <el-select v-model="listQuery.isEnabled" placeholder="状态" clearable size="small">
            <el-option label="全部" value="-1" />
            <el-option label="正常" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-date-picker
            v-model="dateTime"
            :picker-options="pickerOptions"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            align="right"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            v-waves
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="handleFilter"
          >搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            v-waves
            type="warning"
            icon="el-icon-refresh"
            size="small"
            @click="handleFilterClear"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作 -->
    <el-row style="margin-bottom: 10px;">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-tooltip content="刷新" placement="top">
          <el-button
            v-waves
            type="warning"
            icon="el-icon-refresh"
            circle
            @click="handleFilterClear"
          />
        </el-tooltip>
        <!-- <el-tooltip content="添加" placement="top">
          <el-button v-waves type="success" icon="el-icon-plus" circle @click="handleCreate" />
        </el-tooltip> -->
        <!-- <el-tooltip content="搜索" placement="top">
          <el-button
            v-waves
            type="primary"
            icon="el-icon-search"
            circle
            @click="showSearch = !showSearch"
          />
        </el-tooltip> -->
        <!-- <el-tooltip content="删除" placement="top">
          <el-button
            v-waves
            :loading="deleting"
            :disabled="buttonDisabled"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="handleDeleteAll()"
          />
        </el-tooltip> -->
        <el-tooltip content="更多" placement="top">
          <el-dropdown
            trigger="click"
            placement="bottom"
            style="margin-left: 10px;"
            @command="handleCommand"
          >
            <el-button :disabled="buttonDisabled" type="Info" circle>
              <i class="el-icon-more" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">设为正常</el-dropdown-item>
              <el-dropdown-item command="0">设为禁用</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-tooltip>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      class="headercellclassname"
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      stripe
      :row-style="{backgroundColor: '#000e21'}"
      :cell-style="{borderColor: '#000e21'}"
      :header-cell-style="{background: '#011531',borderColor: '#000e21'}"
      border
      fit
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="设备序列码" align="center" width="300" fixed>
        <template slot-scope="scope">
          <span>{{ scope.row.UnitNo }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="头像" width="60px" fixed>
        <template slot-scope="scope">
          <span class="link-type" @click="handleImg(scope.row.img)">
            <img :src="scope.row.img" width="40" height="40" />
          </span>
        </template>
      </el-table-column> -->
      <el-table-column label="账号" width="150px" align="center" fixed>
        <template slot-scope="scope">
          <span
            class="link-type"
            @click="handleUpdate(scope.$index,scope.row.id)"
          >{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110px" align="center">
        <template slot-scope="scope">
          <span
            :class="{'el-icon-success text-green':scope.row.isEnabled == 1,'el-icon-error text-red':scope.row.isEnabled == 0}"
            @click="handleModifyStatus(scope.$index,scope.row.id,scope.row.isEnabled)"
          >{{ scope.row.isEnabled | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.regTime|parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="120px"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button
              v-waves
              type="primary"
              icon="el-icon-edit-outline"
              circle
              @click="handleUpdate(scope.$index,scope.row.id)"
            />
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button
              v-waves
              :loading="scope.row.delete"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="handleDelete(scope.$index,scope.row.id)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-show="total>0"
        :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.psize"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 表单 -->
    <adminForm ref="fromAdmin" @updateRow="updateRow" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getList, del, change, delAll, changeAll } from "@/api/admin";
import waves from "@/directive/waves";
import { parseTime, pickerOptions, getArrByKey } from "@/utils";
import adminForm from "./admin/form";
import openWindow from "@/utils/openWindow";

export default {
  name: "Admin",
  components: { adminForm },
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "禁用",
        1: "正常"
      };
      return statusMap[status];
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
        isEnabled: "-1",
        userName: "",
        phone: "",
        realName: "",
        startTime: "",
        endTime: ""
      },
      buttonDisabled: true,
      deleting: false,
      dateTime: "",
      pickerOptions: pickerOptions,
      currentIndex: -1
    };
  },
  computed: {
    ...mapGetters([
      'group',
      'code'
    ]),
  },
  watch: {
    dateTime: function(val) {
      this.listQuery.startTime = val[0];
      this.listQuery.endTime = val[1];
    }
  },
  created() {
    this.fetchList();
  },
  methods: {
    fetchList() {
      this.listLoading = true;
      this.listQuery.jdName = this.group;
      this.listQuery.UnitNo = this.code;
      getList(this.listQuery).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.fetchList();
    },
    handleFilterClear() {
      this.listQuery = {
        page: 1,
        psize: 10,
        isEnabled: "-1",
        userName: "",
        phone: "",
        realName: "",
        startTime: "",
        endTime: ""
      };
      this.dateTime = "";
      this.fetchList();
    },
    handleSizeChange(val) {
      this.listQuery.psize = val;
      this.fetchList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.fetchList();
    },
    handleModifyStatus(index, id, isEnabled) {
      return false;
      this.list[index]["isEnabled"] = 1 - isEnabled;
      change(id, "isEnabled", 1 - isEnabled).then(response => {});
    },
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.buttonDisabled = false;
      } else {
        this.buttonDisabled = true;
      }
      this.selectedRows = val;
    },
    handleImg(img) {
      openWindow(img, "图片预览", "500", "400");
    },
    handleCreate() {
      this.$refs.fromAdmin.handleCreate();
    },
    handleUpdate(index, id) {
      this.currentIndex = index;
      this.$refs.fromAdmin.handleUpdate(id);
    },
    updateRow(temp) {
      if (this.currentIndex >= 0 && temp.id > 0) {
        this.list.splice(this.currentIndex, 1, temp);
      } else {
        if (this.list.length >= 10) {
          this.list.pop();
        }
        this.list.unshift(temp);
        this.total = this.total + 1;
      }
      this.currentIndex = -1;
    },
    handleDelete(index, id) {
      const _this = this;
      this.$confirm("不能删除该记录", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return false
          _this.$set(_this.list[index], "delete", true);
          del(id)
            .then(response => {
              if (response.status === 1) {
                _this.list.splice(index, 1);
                _this.total = _this.total - 1;
                _this.$notify.success(response.msg);
              } else {
                _this.$notify.error(response.msg);
              }
              _this.$set(_this.list[index], "delete", false);
            })
            .catch(error => {
              _this.$set(_this.list[index], "delete", false);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleDeleteAll() {
      const _this = this;
      if (this.selectedRows.length > 0) {
        this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            _this.deleting = true;
            const ids = getArrByKey(_this.selectedRows, "id");
            const idstr = ids.join(",");
            delAll({ ids: idstr })
              .then(response => {
                if (response.status === 1) {
                  const delindex = [];
                  _this.list.forEach(function(item, index, input) {
                    if (ids.indexOf(item.id) > -1) {
                      delindex.push(index);
                    }
                  });
                  for (let i = delindex.length - 1; i >= 0; i--) {
                    _this.list.splice(delindex[i], 1);
                  }
                  _this.total = _this.total - delindex.length;
                  _this.$message.success(response.msg);
                } else {
                  _this.$message.error(response.msg);
                }
                _this.deleting = false;
              })
              .catch(error => {
                _this.deleting = false;
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        _this.$message.error("请选择要删除的数据");
      }
    },
    handleCommand(command) {
      const _this = this;
      if (this.selectedRows.length > 0) {
        const ids = getArrByKey(this.selectedRows, "id");
        const idstr = ids.join(",");
        changeAll({ val: idstr, field: "isEnabled", value: command })
          .then(response => {
            if (response.status === 1) {
              _this.list.forEach(function(item, index, input) {
                if (ids.indexOf(item.id) > -1) {
                  _this.list[index]["isEnabled"] = command;
                }
              });
              _this.$message.success(response.msg);
            } else {
              _this.$message.error(response.msg);
            }
          })
          .catch(error => {});
      } else {
        _this.$message.error("请选择要操作的数据");
      }
    }
  }
};
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
</style>
