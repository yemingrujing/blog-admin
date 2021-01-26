<template>
  <div class="app-container">
    <!-- 表格查询条件 -->
    <div class="filter-container">
      <el-input v-model.trim="listQuery.imageTitle" placeholder="图片名称" style="width: 200px;" clearable />
      <el-button type="primary" class="filter-item" @click="search">查询</el-button>
      <el-button type="primary" class="filter-item" @click="add">添加</el-button>
    </div>
    <nice-table
      :table-header="tableHeader"
      :list="list"
      :toolbar-list="toolbarList"
      :list-loading="loading"
      @emitEvent="(args)=>this.$emitEvent(args)"
    />
    <el-dialog title="添加图片" :visible.sync="alterVisible" width="600px" @close="closeDialog">
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-form-item label="图片名称" prop="imageTitle">
          <el-input v-model.trim="form.imageTitle" clearable />
        </el-form-item>
        <el-form-item label="上传路径" prop="path">
          <el-select ref="role" v-model="form.path" placeholder="选择上传路径" clearable class="filter-item">
            <el-option label="/blog/common/" value="/blog/common/" />
            <el-option label="/blog/article/" value="/blog/article/" />
            <el-option label="/blog/cover/" value="/blog/cover/" />
            <el-option label="/blog/gallery/" value="/blog/gallery/" />
            <el-option label="/blog/avatar/" value="/blog/avatar/" />
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="avatar">
          <!-- 图片上传控件-->
          <el-row>
            <el-upload
              v-if="isShowUpload"
              ref="upload"
              drag
              action=""
              list-type="picture"
              :auto-upload="false"
              :on-change="onUploadChange"
              :accept="'image/jpeg,image/gif,image/png,image/bmp,image/jpg,image/x-icon'"
            >
              <i class="el-icon-upload" style="color:#409EFF" />
              <div class="el-upload__text text">
                将图片拖到此处，或
                <em>点击上传</em>
              </div>
              <div
                slot="tip"
                class="el-upload__tip text"
              >提示：可支持PNG、JPG、BMP，图片大小不超过4M,长边不大于4096像素，请保证识别的部分为图片的主题部分
              </div>
            </el-upload>
          </el-row>
          <!-- 本地预览需要上传处理的图片-->
          <el-row v-if="isShowImgUpload">
            <el-image
              class="image-show-dragger"
              :src="localUrl"
              :preview-src-list="[localUrl]"
              fit="fill"
            />
          </el-row>
          <div style="padding: 5px;">
            <el-button type="primary" :loading="false" size="small" @click="reUpload">重新上传</el-button>
            <el-button type="primary" :loading="false" size="small" @click="uploadReq">立即处理</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 分页 -->
    <nice-pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="search" />
  </div>
</template>

<script>
import { del, search, upload } from '@/api/images';
import { copy } from '@/utils/common';

export default {
  name: 'Images',
  data() {
    return {
      isShowUpload: true,
      isShowImgUpload: false,
      localUrl: '',
      list: [],
      articleData: [],
      total: 0,
      loading: true,
      alterVisible: false,
      images: undefined,
      form: { imageUrl: '', imageTitle: '', path: '' },
      listQuery: { page: 1, imageTitle: '', limit: 10 },
      tableHeader: [
        { field: 'imageTitle', sortable: 'custom', title: '名称' },
        { field: 'imageUrl', title: '预览', img: 'imageUrl' },
        { field: 'imageUrl', title: '图片地址', tooltip: true },
        { field: 'createTime', title: '创建时间' },
        { field: 'toolbar', title: '操作' }
      ],
      toolbarList: [{ title: '删除', field: 'handleDel', type: 'danger' }]
    };
  },
  watch: {
    alterVisible() {
      !this.alterVisible && this.search();
    }
  },
  created() {
    this.search();
  },
  methods: {
    setIcon(url) {
      this.form.imageUrl = url;
      copy(url);
      this.alterVisible = false;
    },
    search(k) {
      this.loading = true;
      k && (this.listQuery.page = k.page);
      search(this.listQuery).then(res => {
        this.loading = false;
        this.list = res.list;
        this.total = res.total;
      }).catch(() => {
        this.loading = false;
      });
    },
    add() {
      this.alterVisible = true;
      this.form = { imageTitle: '', imageUrl: '', path: '/blog/common/', file: '' };
    },
    handleDel(data) {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        del(data).then(() => {
          this.search();
        }).catch(() => {
          this.loading = false;
        });
      }).catch(() => {
        this.loading = false;
      });
    },
    uploadReq() {
      if (!this.form.imageTitle) {
        this.$message.error('图片名称不能为空');
        return;
      }
      if (!this.images) {
        this.$message.error('图片不能为空');
        return;
      }

      this.loading = true;
      const params = new FormData();
      params.append('file', this.images.raw);
      params.append('imageTitle', this.form.imageTitle);
      params.append('path', this.form.path);
      upload(params).then(res => {
        this.loading = false;
        this.alterVisible = false;
      }).catch(() => {
        this.loading = false;
      });

      upload(this.form).then(() => {
        this.search();
        this.alterVisible = false;
      });
    },
    reUpload() {
      this.localUrl = '';
      this.isShowImgUpload = false;
      this.isShowUpload = true;
    },
    onUploadChange(file) {
      // 校验
      const isIMAGE = /png|jpg|jpeg|bmp|gif|ico/.test(file.raw.type);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isIMAGE) {
        this.$message.error('图片格式错误,仅支持png、jpg、jpeg、bmp、gif');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2MB!');
        return false;
      }

      let URL = null;
      if (window.createObjectURL) {
        // basic
        URL = window.createObjectURL(file.raw);
      } else if (window.URL) {
        // mozilla(firefox)
        URL = window.URL.createObjectURL(file.raw);
      } else if (window.webkitURL) {
        // webkit or chrome
        URL = window.webkitURL.createObjectURL(file.raw);
      }
      this.localUrl = URL;
      this.isShowImgUpload = true;// 呈现本地预览组件
      this.isShowUpload = false;// 隐藏上传组件
      this.images = file;
    },
    closeDialog() {
      this.localUrl = '';
      this.isShowImgUpload = false;
      this.isShowUpload = true;
    }
  }
};
</script>

<style scoped>
.image-show-dragger {
  background-color: #fff;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  box-sizing: border-box;
  text-align: center;
  margin-top: -25px;
  width: 360px;
  height: 180px;
}
</style>
