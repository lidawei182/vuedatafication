<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div v-if="showSearch" class="filter-container">
      <el-form :inline="true" :model="listQuery" class="form-inline">
        <el-form-item label="">
          <el-input v-model="listQuery.oldmanname" placeholder="用户名" clearable size="small"/>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="dateTime"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd" 
            clearable
            size="small"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button v-waves type="primary" icon="el-icon-search" size="small" @click="handleFilter">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-waves type="warning" icon="el-icon-refresh" size="small" @click="handleFilterClear">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 下载 -->
    <div v-if="showExport" class="filter-container" style="margin-bottom: 20px;">
      <FilenameOption style="margin-right: 10px;" v-model="filename" />
      <BookTypeOption style="margin-right: 10px;" v-model="bookType" />
      <el-button
        v-waves
        :loading="downloadLoading"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >下载</el-button>
    </div>

    <!-- 操作 -->
    <el-row style="margin-bottom: 10px;">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-tooltip content="刷新" placement="top">
          <el-button v-waves type="warning" icon="el-icon-refresh" circle @click="handleFilterClear"/>
        </el-tooltip>
        <el-tooltip content="搜索" placement="top">
          <el-button v-waves type="primary" icon="el-icon-search" circle @click="showSearch = !showSearch"/>
        </el-tooltip>
        <el-tooltip content="Export" placement="top">
          <el-button
            v-waves
            :loading="downloadLoading"
            circle
            type="primary"
            icon="el-icon-download"
            @click="showExport = !showExport"
          />
        </el-tooltip>
        <el-tooltip content="首页" placement="top">
          <el-button v-waves type="success" icon="el-icon-s-home" circle @click="routerPushPush"/>
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
      @selection-change="handleSelectionChange"
      style="width: 100%;">
      <el-table-column
        align="center"
        type="selection"
        width="50">
      </el-table-column>
      <el-table-column label="老人姓名" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.oldmanname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.Address }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="状态" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row | statusFilter(this_) }}</span>
        </template>
      </el-table-column> -->

      <el-table-column label="呼叫时刻" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.calltime|parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="接听时刻" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.taketime|parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="挂断时刻" width="160px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endtime|parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="备注信息" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column> -->
      
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination v-show="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.psize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { historyCallsList } from '@/api/dashboard'
import waves from '@/directive/waves'
import { parseTime, pickerOptions } from '@/utils'
// options components
import FilenameOption from "@/components/FilenameOption";
import BookTypeOption from "@/components/BookTypeOption";

export default {
  name: 'logLog',
  components: { FilenameOption, BookTypeOption },
  directives: {
    waves
  },
  filters: {
    statusFilter(data,this_) {
      let taketime = data.taketime;
      let s = "挂断";
      if(data.status == "呼叫"){
        s = data.status;
      }else if(data.status == "拉绳"){
        s = data.status;
      }else if( data.status != '挂断' && taketime == '' || taketime == null){
        s = "异常挂断";
      }else if(taketime == '' || taketime == null && data.endtime){
        s = "已处理";
      }else if(taketime && data.status == "挂断"){
        s = "已处理";
      }
      for(let i = 0; this_.list.length > i; i++){
        if(this_.list[i].No == data.No){
          this_.list[i].statusNo = s;
        }
      }
      return s;
    }
  },
  computed: {
    ...mapGetters([
      'jdno'
    ]),
  },
  data() {
    return {
      exportList:[],//选择导出
      this_: this,
      filename: "",
      bookType: "xlsx",
      downloadLoading: false,
      showExport: false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      showSearch: false,
      listQuery: {
        jdno: "",
        id: "",
        oldmanname: "",
        page: 1,
      },
      dateTime: '',
      pickerOptions: pickerOptions,
    }
  },
  watch: {
    dateTime: function(val) {
      this.listQuery.calltime = val[0]
      this.listQuery.endtime = val[1]
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    handleSelectionChange(val){
      if(val.length > 0){
        this.exportList = [];
        this.exportList = val;
      }else{
        this.exportList = [];
        this.exportList = this.list;
      }
    },
    routerPushPush() {
      this.$router.push({path: '/dashboard'});
    },
    fetchList() {
      this.listLoading = true
      this.listQuery.jdno = this.jdno; 
      historyCallsList(this.listQuery).then(response => {
        this.list = response.data.data.list
        this.exportList = this.list
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
        id: '',
        oldmanname: '',
        calltime: '',
        endtime: ''
      }
      this.dateTime = ''
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
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "老人姓名",
          "地址",
          "呼叫时刻",
          "接听时刻",
          "挂断时刻"
        ];
        const filterVal = [
          "oldmanname",
          "Address",
          "calltime",
          "taketime",
          "endtime"
        ];
        const data = this.formatJson(filterVal, this.exportList);
      
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          bookType: this.bookType
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
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
</style>