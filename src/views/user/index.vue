<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div v-if="showSearch" class="filter-container">

      <el-form :inline="true" :model="listQuery" class="form-inline">

        <el-form-item label>
          <el-input v-model="listQuery.deviceno" placeholder="呼叫器特征码" clearable size="small" />
        </el-form-item>
        <el-form-item label>
          <el-input v-model="listQuery.oldmanname" placeholder="名称" clearable size="small" />
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
          <el-button
            v-waves
            type="warning"
            icon="el-icon-refresh"
            circle
            @click="handleFilterClear"
          />
        </el-tooltip>
        <el-tooltip content="搜索" placement="top">
          <el-button
            v-waves
            type="primary"
            icon="el-icon-search"
            circle
            @click="showSearch = !showSearch"
          />
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
      @sort-change="sortChange"
      @selection-change="handleSelectionChange"
      style="width: 100%;"
    >
    <el-table-column
      align="center"
      type="selection"
      width="50">
    </el-table-column>
      <el-table-column
        label="呼叫器特征码"
        prop="deviceno"
        sortable="custom"
        align="center"
        width="200"
        fixed
        :class-name="getSortClass('deviceno')"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.deviceno }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.oldmanname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Contact }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生日" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.birthday }}</span> 
        </template>
      </el-table-column>
      <el-table-column label="身份证" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.identity_card }}</span> 
        </template>
      </el-table-column>
      <el-table-column label="健康状态" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Healthy }}</span> 
        </template>
      </el-table-column>
      <el-table-column label="子女情况" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Children_situation }}</span> 
        </template>
      </el-table-column>
      <el-table-column label="居住情况" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Residence_state }}</span> 
        </template>
      </el-table-column>
      <el-table-column label="婚姻状态" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.marital_status }}</span> 
        </template>
      </el-table-column>
      <el-table-column label="老人类型" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.oldman_type }}</span> 
        </template>
      </el-table-column>
      <el-table-column label="地址" :show-overflow-tooltip="true" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.Address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="病史" :show-overflow-tooltip="true" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.pathography }}</span>
        </template>
      </el-table-column>
      <el-table-column label="过敏史" :show-overflow-tooltip="true" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.anaphylactic }}</span>
        </template>
      </el-table-column>
      <el-table-column label="其他说明" :show-overflow-tooltip="true" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人(1)" :show-overflow-tooltip="true" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.lianxiren1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人(2)" :show-overflow-tooltip="true" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.lianxiren2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人(3)" :show-overflow-tooltip="true" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.lianxiren3 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人(4)" :show-overflow-tooltip="true" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.lianxiren4 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人(5)" :show-overflow-tooltip="true" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.lianxiren5 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人(6)" :show-overflow-tooltip="true" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.lianxiren6 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人(7)" :show-overflow-tooltip="true" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.lianxiren7 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人(8)" :show-overflow-tooltip="true" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.lianxiren8 }}</span>
        </template>
      </el-table-column>
      <el-table-column
      fixed="right"
      label="操作"
      align="center"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
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
    <userForm ref="fromUser" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getPeopleList } from '@/api/dashboard'
import waves from "@/directive/waves";
import { parseTime, pickerOptions } from "@/utils";
import userForm from "./user/form";
// options components
import FilenameOption from "./components/FilenameOption";
import BookTypeOption from "./components/BookTypeOption";

export default {
  name: "User",
  components: { FilenameOption, BookTypeOption, userForm },
  directives: {
    waves
  },
  filters: {

  },
  computed: {
    ...mapGetters([
      'jdno'
    ]),
  },
  data() {
    return {
      exportList:[],//选择导出
      tableKey: 0,
      list: null,
      total: null,
      filename: "",
      bookType: "xlsx",
      listLoading: true,
      showSearch: false,
      showExport: false,
      listQuery: {
        page: 1,
        psize: 10,
        sort: "+deviceno",
        jdno: "",
        deviceno: "",
        oldmanname: ""
      },
      downloadLoading: false,
      pickerOptions: pickerOptions
    };
  },
  watch: {

  },
  created() {
    this.fetchList();
  },
  methods: {
    handleClick(row){
      this.$refs.fromUser.handleCreate(row);
    },
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
      this.listLoading = true;
      this.listQuery.jdno = this.jdno;
      getPeopleList(this.listQuery).then(response => {
        this.list = response.data.data;
        this.exportList = this.list;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.fetchList();
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "deviceno") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+deviceno";
      } else {
        this.listQuery.sort = "-deviceno";
      }
      this.handleFilter();
    },
    handleFilterClear() {
      this.listQuery = {
        page: 1,
        psize: 10,
        sort: "+deviceno",
        jdno: "",
        deviceno: "",
        oldmanname: ""
      };
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
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "呼叫器特征码",
          "名称",
          "联系",
          "性别",
          "生日",
          "身份证",
          "机能评估",
          "子女情况",
          "居住情况",
          "婚姻状态",
          "老人类型",
          "地址",
          "病史",
          "过敏史",
          "其他说明",
          "联系人(1)",
          "联系人(2)",
          "联系人(3)",
          "联系人(4)",
          "联系人(5)",
          "联系人(6)",
          "联系人(7)",
          "联系人(8)",
        ];
        const filterVal = [
          "deviceno", 
          "oldmanname", 
          "Contact", 
          "sex", 
          "birthday", 
          "identity_card", 
          "Healthy", 
          "Children_situation", 
          "Residence_state", 
          "marital_status", 
          "oldman_type",
          "Address",
          "pathography",
          "anaphylactic",
          "remark",
          "lianxiren1",
          "lianxiren2",
          "lianxiren3",
          "lianxiren4",
          "lianxiren5",
          "lianxiren6",
          "lianxiren7",
          "lianxiren8"
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}`
        ? "ascending"
        : sort === `-${key}`
        ? "descending"
        : "";
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
