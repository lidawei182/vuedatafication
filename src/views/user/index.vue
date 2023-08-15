<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div v-if="showSearch" class="filter-container">

      <el-form :inline="true" :model="listQuery" class="form-inline">

        <el-form-item label>
          <el-input v-model="listQuery.oldmanname" placeholder="老人姓名" clearable size="small" />
        </el-form-item>

        <el-form-item label>
          <el-input v-model="listQuery.Contact" placeholder="联系方式" clearable size="small" />
        </el-form-item>

        <el-form-item label>
          <el-input v-model="listQuery.identity_card" placeholder="身份证" clearable size="small" />
        </el-form-item>

        <el-form-item label>
          <el-input v-model="listQuery.deviceno" placeholder="绑定设备编号" clearable size="small" />
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
      <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download"
        @click="handleDownload">下载</el-button>
    </div>
    <!-- 操作 -->
    <el-row style="margin-bottom: 10px;">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-tooltip content="刷新" placement="top">
          <el-button v-waves type="warning" icon="el-icon-refresh" circle @click="handleFilterClear" />
        </el-tooltip>
        <el-tooltip content="搜索" placement="top">
          <el-button v-waves type="primary" icon="el-icon-search" circle @click="showSearch = !showSearch" />
        </el-tooltip>
        <el-tooltip content="Export" placement="top">
          <el-button v-waves :loading="downloadLoading" circle type="primary" icon="el-icon-download"
            @click="showExport = !showExport" />
        </el-tooltip>
        <el-tooltip content="首页" placement="top">
          <el-button v-waves type="success" icon="el-icon-s-home" circle @click="routerPushPush" />
        </el-tooltip>
          <div style="float: right;">
            <el-tooltip content="在线" placement="top" v-if="isonlinehave.isonline">
              <span style="color: #22eb47;margin-right: 10px;">{{isonlinehave.isonline}}设备数{{isonlinehave.have}}</span>
            </el-tooltip>
            <el-tooltip content="在离" placement="top" v-if="isonlinenot.isonline">
              <span style="color: #aaa9a9;margin-right: 10px;">{{isonlinenot.isonline}}设备数{{isonlinenot.have}}</span>
            </el-tooltip>
            <el-tooltip content="总设备数" placement="top" v-if="total">
              <span style="color: #ffffff;">总设备数{{total}}</span>
            </el-tooltip>
          </div>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table class="headercellclassname" v-loading="listLoading" :key="tableKey" :data="list" stripe
      :row-style="{ backgroundColor: '#000e21' }" :cell-style="{ borderColor: '#000e21' }"
      :header-cell-style="{ background: '#011531', borderColor: '#000e21' }" border fit @sort-change="sortChange"
      @selection-change="handleSelectionChange" style="width: 100%;">
      <el-table-column align="center" type="selection" width="50">
      </el-table-column>
      <el-table-column label="绑定设备编号" prop="deviceno" sortable="custom" align="center" width="200" fixed
        :class-name="getSortClass('deviceno')">
        <template slot-scope="scope">
          <span>{{ scope.row.deviceno }}</span>
        </template>
      </el-table-column>
      <el-table-column label="老人姓名" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.oldmanname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.Contact }}</span>
        </template>
      </el-table-column>
      <el-table-column label="家庭住址" :show-overflow-tooltip="true" min-width="160px">
        <template slot-scope="scope">
          <span>{{ scope.row.Address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出生年月" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.birthday }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.age }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.identity_card }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否在线" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isonline }}</span>
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
      <el-table-column fixed="right" label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination v-show="total > 0" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.psize" :total="total" background layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 表单 -->
    <userForm ref="fromUser" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getPeopleList, havePeopleList } from '@/api/dashboard'
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
      'jdno',
      'code'
    ]),
  },
  data() {
    return {
      isonlinehave: 0,
      isonlinenot: 0,
      exportList: [],//选择导出
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
        code: "",
        deviceno: "",
        oldmanname: "",
        Contact: "",
        identity_card: ""
      },
      downloadLoading: false,
      pickerOptions: pickerOptions
    };
  },
  watch: {

  },
  created() {
    this.fetchList();
    this.getHave();
  },
  methods: {
    analyzeIDCard(IDCard) {
      var getDataByIdCard = {};
      //获取用户身份证号码
      //获取性别
      if (parseInt(IDCard.substr(16, 1)) % 2 == 1) {
        getDataByIdCard.sexCode = '男'
      } else {
        getDataByIdCard.sexCode = '女'
      }
      //获取出生年月日
      var yearBirth = IDCard.substring(6, 10);
      var monthBirth = IDCard.substring(10, 12);
      var dayBirth = IDCard.substring(12, 14);
      var birthDate = yearBirth + "-" + monthBirth + "-" + dayBirth;
      //获取当前年月日并计算年龄
      var myDate = new Date();
      var monthNow = myDate.getMonth() + 1;
      var dayNow = myDate.getDay();
      var age = myDate.getFullYear() - yearBirth;
      if (monthNow < monthBirth || (monthNow == monthBirth && dayNow < dayBirth)) {
        age--;
      }
      //得到年龄
      getDataByIdCard.birthDate = birthDate;
      getDataByIdCard.age = age;
      //返回性别和年龄
      return getDataByIdCard;
    },
    getGender(idNumber) {
      let res = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
      if (idNumber && res.test(idNumber)) {
        let genderCode = idNumber.charAt(16);
        if (parseInt(genderCode) % 2 == 0) {
          return '女';
        }
        return '男';
      } else {
        return '身份证格式输入有误！';
      }
    },
    GetAge(identityCard) {
      var len = (identityCard + "").length;
      if (len == 0) {
        return 0;
      } else {
        if ((len != 15) && (len != 18))//身份证号码只能为15位或18位其它不合法
        {
          return 0;
        }
      }
      var strBirthday = "";
      if (len == 18)//处理18位的身份证号码从号码中得到生日和性别代码
      {
        strBirthday = identityCard.substr(6, 4) + "/" + identityCard.substr(10, 2) + "/" + identityCard.substr(12, 2);
      }
      if (len == 15) {
        strBirthday = "19" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
      }
      //时间字符串里，必须是“/”
      var birthDate = new Date(strBirthday);
      var nowDateTime = new Date();
      var age = nowDateTime.getFullYear() - birthDate.getFullYear();
      //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
      if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    handleClick(row) {
      this.$refs.fromUser.handleCreate(row);
    },
    handleSelectionChange(val) {
      if (val.length > 0) {
        this.exportList = [];
        this.exportList = val;
      } else {
        this.exportList = [];
        this.exportList = this.list;
      }
    },
    routerPushPush() {
      this.$router.push({ path: '/dashboard' });
    },
    getHave(){
      havePeopleList({'code': this.code}).then(response => {
        let have = response.data.data.have;
        if(!have){return false};
        if(have.length > 0){
          this.isonlinehave = response.data.data.have[0];
          if(response.data.data.have.length > 1){
            this.isonlinenot = response.data.data.have[1];
          }else{
            this.isonlinenot = {'have': 0, 'isonline': '在线'};
          }
        }
      });
    },
    fetchList() {
      this.listLoading = true;
      this.listQuery.code = this.code;
      getPeopleList(this.listQuery).then(response => {
        this.list = response.data.data.list;
        if (this.list.length > 0) {
          for (let i = 0; this.list.length > i; i++) {
            this.list[i].gender = this.analyzeIDCard(this.list[i].identity_card).sexCode;
            this.list[i].age = this.analyzeIDCard(this.list[i].identity_card).age;
            this.list[i].birthday = this.analyzeIDCard(this.list[i].identity_card).birthDate;
            this.list[i].Children_situation = this.list[i].Children_situation ? this.list[i].Children_situation : '==子女情况==';
            this.list[i].Healthy = this.list[i].Healthy ? this.list[i].Healthy : '==健康状态==';
            this.list[i].Residence_state = this.list[i].Residence_state ? this.list[i].Residence_state : '==居住情况==';
            this.list[i].marital_status = this.list[i].marital_status ? this.list[i].marital_status : '==婚姻状态==';
            this.list[i].oldman_type = this.list[i].oldman_type ? this.list[i].oldman_type : '==老人类型==';
          }
        }
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
        code: "",
        deviceno: "",
        oldmanname: "",
        Contact: "",
        identity_card: ""
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
          "绑定设备编号",
          "老人姓名",
          "联系方式",
          "家庭住址",
          "出生年月",
          "性别",
          "年龄",
          "身份证",
          "是否在线",
          "健康状态",
          "子女情况",
          "居住情况",
          "婚姻状态",
          "老人类型",
          "病史",
          "过敏史",
          "其他说明",
          "联系人(1)",
          "联系人(2)",
          "联系人(3)",
          "联系人(4)"
        ];
        const filterVal = [
          "deviceno",
          "oldmanname",
          "Contact",
          "Address",
          "birthday",
          "gender",
          "age",
          "identity_card",
          "isonline",
          "Healthy",
          "Children_situation",
          "Residence_state",
          "marital_status",
          "oldman_type",
          "pathography",
          "anaphylactic",
          "remark",
          "lianxiren1",
          "lianxiren2",
          "lianxiren3",
          "lianxiren4"
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
    getSortClass: function (key) {
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
.headercellclassname {
  border: 0;
  color: #fff;
}

// 背景颜色
::v-deep .el-table .el-table__body tr.el-table__row td {
  background: rgba(79, 218, 255, 0.1);
}

// 表格斑马自定义颜色
::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: rgba(0, 0, 0, 0.1);
}

.el-table::before {
  left: 0;
  bottom: 0;
  width: 0;
  height: 0;
}

::v-deep .el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: #011531;
}

::v-deep .el-table__fixed-right::before {
  background-color: #011531;
}

::v-deep .el-table__fixed::before {
  background-color: #011531;
}
</style>
