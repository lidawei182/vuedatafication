<template>
  <div class="upload-container">
    <el-upload
      :show-file-list="true"
      :data="dataobj"
      :action="action"
      :multiple="multiple"
      :name="fileName"
      :accept="accept"
      :drag="drag"
      :limit="limit"
      :file-list="fileList"
      :on-preview="handlePreview"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :on-progress="onProgress"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      class="image-uploader"
      list-type="picture-card"
    >
      <i class="el-icon-plus" />
    </el-upload>
  </div>
</template>

<script>
import openWindow from "@/utils/openWindow";
import { getNowTime } from "@/utils";
export default {
  name: "ImagesUpload",
  props: {
    value: {
      type: Array,
      default: function() {
        return [];
      }
    },
    config: {
      type: Object,
      default: function() {
        return {
          fileName: "file",
          limit: 5,
          multiple: false,
          accept: "image/*",
          action: "",
          drag: false
        };
      }
    }
  },
  data() {
    return {
      limit: this.config.limit,
      fileName: this.config.fileName,
      multiple: this.config.multiple,
      accept: this.config.accept,
      action: this.config.action,
      drag: this.config.drag,
      dataobj: { filename: this.config.fileName }
    };
  },
  computed: {
    fileList() {
      const imgarr = [];
      if (this.value === "") {
        return [];
      }
      if (typeof this.value === "string") {
        return [];
      }
      for (let i = 0; i < this.value.length; i++) {
        imgarr.push({
          url: this.value[i].url,
          id: this.value[i].id,
          createtime: this.value[i].createtime
        });
      }
      return imgarr;
    }
  },
  methods: {
    emitInput(val) {
      this.$emit("input", val);
    },
    handleRemove(file, fileList) {
      if (fileList.length > 0) {
        this.emitInput(fileList);
      } else {
        this.emitInput([]);
      }
    },
    beforeRemove(file, fileList) {
      console.log(file, fileList);
      // 删除图片
      this.$emit("beforeRemove", file);
    },
    handlePreview(file) {
      openWindow(file.url, "图片预览", "500", "400");
    },
    handleExceed(files, fileList) {
      console.log(files, fileList);
      this.$message.error("最多上传" + this.limit + "张图片");
    },
    beforeUpload(file) {
      const isIMG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isIMG) {
        this.$message.error("上传图片只能是 JPG、PNG 格式!");
        return false;
      }
      if (!isLt5M) {
        this.$message.error("上传图片大小不能超过 5MB!");
        return false;
      }
      return isIMG && isLt5M;
    },
    onProgress(event, file, fileList) {
      // console.log('========onProgress=========')
      console.log(event, file, fileList);
      // console.log('========onProgress=========')
    },
    handleSuccess(res, file, fileList) {
      if (res.status === 1) {
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i]["uid"] === file["uid"]) {
            fileList[i]["url"] = res.data.url;
            fileList[i]["id"] = 0;
            fileList[i]["createtime"] = getNowTime();
            break;
          }
        }
        this.emitInput(fileList);
      } else {
        for (let i = 0; i < fileList.length; i++) {
          if (fileList[i]["uid"] === file["uid"]) {
            fileList.splice(i, 1);
            break;
          }
        }
        this.$message.error(res.msg);
      }
    },
    handleError(err, file, fileList) {
      console.log(file, fileList);
      this.$message.error(err);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.image-uploader {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 320px;
    height: 160px;
    .el-upload-dragger {
      height: 100%;
    }
    &:hover {
      border-color: #409eff;
    }
  }
  .el-upload-list__item {
    width: 320px;
    height: 160px;
    display: block;
  }
  .image {
    width: 100%;
    height: 100%;
    display: block;
  }
  .image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100%;
    line-height: 178px;
    text-align: center;
    display: block;
  }
}
</style>
