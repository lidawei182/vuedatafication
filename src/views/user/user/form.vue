<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form
      ref="dataForm"
      :model="temp"
      label-position="right"
      label-width="120px"
      style="width: 100%; height: 50vh;overflow-y: scroll;"
    >

      <el-form-item label="绑定设备编号">
        <span>{{ temp.deviceno }}</span>
      </el-form-item>
      <el-form-item label="老人姓名">
        <span>{{ temp.oldmanname }}</span>
      </el-form-item>
      <el-form-item label="联系方式">
        <span>{{ temp.Contact }}</span>
      </el-form-item>
      <el-form-item label="家庭住址">
        <span>{{ temp.Address }}</span>
      </el-form-item>
      <el-form-item label="出生年月">
        <span>{{ temp.birthday }}</span>
      </el-form-item>
      <el-form-item label="性别">
        <span>{{ temp.gender }}</span>
      </el-form-item>
      <el-form-item label="年龄">
        <span>{{ temp.age }}</span>
      </el-form-item>
      <el-form-item label="身份证">
        <span>{{ temp.identity_card }}</span>
      </el-form-item>
      <el-form-item label="是否在线">
        <span>{{ temp.isonline }}</span>
      </el-form-item>
      <el-form-item label="健康状态">
        <span>{{ temp.Healthy }}</span>
      </el-form-item>
      <el-form-item label="子女情况">
        <span>{{ temp.Children_situation }}</span>
      </el-form-item>
      <el-form-item label="居住情况">
        <span>{{ temp.Residence_state }}</span>
      </el-form-item>
      <el-form-item label="婚姻状态">
        <span>{{ temp.marital_status }}</span>
      </el-form-item>
      <el-form-item label="老人类型">
        <span>{{ temp.oldman_type }}</span>
      </el-form-item>
      <el-form-item label="病史">
        <span>{{ temp.pathography }}</span>
      </el-form-item>
      <el-form-item label="过敏史">
        <span>{{ temp.anaphylactic }}</span>
      </el-form-item>
      <el-form-item label="其他说明">
        <span>{{ temp.remark }}</span>
      </el-form-item>
      <el-form-item label="联系人(1)">
        <span>{{ temp.lianxiren1 }}</span>
      </el-form-item>
      <el-form-item label="联系人(2)">
        <span>{{ temp.lianxiren2 }}</span>
      </el-form-item>
      <el-form-item label="联系人(3)">
        <span>{{ temp.lianxiren3 }}</span>
      </el-form-item>
      <el-form-item label="联系人(4)">
        <span>{{ temp.lianxiren4 }}</span>
      </el-form-item>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
    </div>

  </el-dialog>
</template>

<script>
export default {
  name: "UserForm",
  components: { },
  data() {
    return {
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: ''
      },
      temp: {},
    };
  },
  watch: {
    dialogFormVisible: function() {
      this.resetTemp();
    }
  },
  destroyed() {},
  methods: {
    resetTemp() {},
    handleCreate(data) {
      this.temp = data;
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    } 
  }
};
</script>

