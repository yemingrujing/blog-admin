<template>
  <div class="app-container">
    <!-- 表格查询条件 -->
    <div class="filter-container">
      <el-input v-model.trim="listQuery.articleTitle" placeholder="文章名称" style="width: 200px;" clearable />
      <el-button type="primary" class="filter-item" @click="search">查询</el-button>
    </div>
    <!-- 表格区域 -->
    <nice-table
      :table-header="tableHeader"
      :formatter="formatter"
      :list="list"
      :toolbar-list="toolbarList"
      :list-loading="loading"
      @emitEvent="(args)=>this.$emitEvent(args)"
    />
    <el-dialog title="回复评论" :visible.sync="alterVisible" width="400px">
      <el-input
        v-model.trim="form.commentContent"
        type="textarea"
        :rows="4"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="alterVisible = false">取 消</el-button>
        <el-button type="primary" @click="ok()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分页 -->
    <nice-pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="search" />
  </div>
</template>

<script>
import { comments, add, del, status } from '@/api/comment';

export default {
  name: 'Comment',
  data() {
    return {
      list: [],
      articleData: [],
      total: 0,
      loading: true,
      form: { commentContent: '' },
      alterVisible: false,
      listQuery: { page: 1, articleTitle: '' },
      tableHeader: [
        { field: 'articleTitle', sortable: 'custom', title: '文章' },
        { field: 'commentContent', sortable: 'custom', title: '评论', tooltip: true },
        { field: 'nickName', sortable: 'custom', title: '昵称' },
        { field: 'email', sortable: 'custom', title: '邮箱' },
        { field: 'author', sortable: 'custom', title: '类型', formatter: 'author' },
        { field: 'status', title: '状态', switch: 'handleStatus', inactive: 0, active: 1 },
        { field: 'commentDate', title: '评论时间' },
        { field: 'browserName', title: '设备' },
        { field: 'systemName', title: '操作系统' },
        { field: 'toolbar', title: '操作' }
      ],
      toolbarList: [{ title: '回复', field: 'handleReplay', type: 'primary' }, {
        title: '删除',
        field: 'handleDel',
        type: 'danger'
      }]
    };
  },
  created() {
    this.search();
  },
  methods: {
    formatter(row, field) {
      return row[field] ? '作者回复' : '游客评论';
    },
    search(k) {
      this.loading = true;
      k && (this.listQuery.page = k.page);
      comments(this.listQuery).then(res => {
        this.loading = false;
        this.list = res.list;
        this.total = res.total;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleReplay(data) {
      this.form.parentId = !data.parentId ? data.id : data.parentId;
      this.form.articleTitle = data.articleTitle;
      this.form.articleId = data.articleId;
      this.form.status = 1;
      this.form.author = 1;
      this.alterVisible = true;
    },
    handleStatus(data) {
      this.loading = true;
      status({ id: data.id, status: data.status }).then(() => {
        this.loading = false;
      }).catch(() => {
        this.search();
      });
    },
    ok() {
      if (!this.form.commentContent) {
        this.$message.error('评论内容不能为空');
        return;
      }
      add(this.form).then(() => {
        this.search();
        this.alterVisible = false;
      });
    },
    handleDel(data) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        del({ id: data.id }).then(() => {
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
