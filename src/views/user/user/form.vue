<template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form
      ref="dataForm"
      :model="temp"
      label-position="right"
      label-width="120px"
      style="width: 100%; height: 50vh;overflow-y: scroll;"
    >

      <el-form-item label="呼叫器特征码">
        <span>{{ temp.deviceno }}</span>
      </el-form-item>
      <el-form-item label="名称">
        <span>{{ temp.oldmanname }}</span>
      </el-form-item>
      <el-form-item label="联系">
        <span>{{ temp.Contact }}</span>
      </el-form-item>
      <el-form-item label="性别">
        <span>{{ temp.sex }}</span>
      </el-form-item>
      <el-form-item label="生日">
        <span>{{ temp.birthday }}</span>
      </el-form-item>
      <el-form-item label="身份证">
        <span>{{ temp.identity_card }}</span>
      </el-form-item>
      <el-form-item label="机能评估">
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
      <el-form-item label="地址">
        <span>{{ temp.Address }}</span>
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
      <el-form-item label="联系人(5)">
        <span>{{ temp.lianxiren5 }}</span>
      </el-form-item>
      <el-form-item label="联系人(6)">
        <span>{{ temp.lianxiren6 }}</span>
      </el-form-item>
      <el-form-item label="联系人(7)">
        <span>{{ temp.lianxiren7 }}</span>
      </el-form-item>
      <el-form-item label="联系人(8)">
        <span>{{ temp.lianxiren8 }}</span>
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

