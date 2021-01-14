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
    <el-dialog title="添加图片" :visible.sync="alterVisible" width="20%">
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-form-item label="图片名称" prop="imageTitle">
          <el-input v-model.trim="form.imageTitle" clearable />
        </el-form-item>
        <el-form-item label="上传路径" prop="path">
          <el-select ref="role" v-model="path" placeholder="选择上传路径" clearable class="filter-item">
            <el-option label="/blog/common/" value="/blog/common/" />
            <el-option label="/blog/article/" value="/blog/article/" />
            <el-option label="/blog/cover/" value="/blog/cover/" />
            <el-option label="/blog/gallery/" value="/blog/gallery/" />
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="avatar">
          <ImgUpLoad :img="form.imageUrl" :title="form.imageTitle" :path="path" @setImg="setIcon" />
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 分页 -->
    <nice-pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="search" />
  </div>
</template>

<script>
import { del, search } from '@/api/images';
import { copy } from '@/utils/common';

import ImgUpLoad from '@/views/common/imgUpload';

export default {
  name: 'Images',
  components: { ImgUpLoad },
  data() {
    return {
      list: [],
      articleData: [],
      total: 0,
      loading: true,
      alterVisible: false,
      path: '/blog/common/',
      form: { imageUrl: '', imageTitle: '' },
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
      this.form = { imageTitle: '', imageUrl: '' };
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
    }
  }
};
</script>

<style scoped>
</style>
