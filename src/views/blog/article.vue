<template>
  <div class="app-container">
    <!-- 表格查询条件 -->
    <div class="filter-container">
      <el-input v-model.trim="listQuery.article_title" placeholder="标题..." style="width: 200px;" clearable />
      <el-button type="primary" class="filter-item" @click="search()">查询</el-button>
      <el-button type="primary" class="filter-item" @click="handleAdd()">添加</el-button>
    </div>
    <!-- 表格区域 -->
    <nice-table
      :table-header="tableHeader"
      :list="list"
      :toolbar-list="toolbarList"
      :list-loading="loading"
      @emitEvent="(args)=>this.$emitEvent(args)"
    />
    <el-dialog :close-on-click-modal="false" title="添加置顶评论" :visible.sync="alterVisible" width="400px">
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
import { list, del, publish } from '@/api/blog';
import { add } from '@/api/comment';

export default {
  name: 'Article',
  data() {
    return {
      list: [],
      listQuery: { page: 1, article_title: '' },
      loading: false,
      tableHeader: [
        { field: 'articleTitle', sortable: 'custom', title: '标题' },
        { field: 'categoryName', sortable: 'custom', title: '分类', width: '100px' },
        { field: 'tagName', sortable: 'custom', title: '标签' },
        { field: 'articleViews', sortable: 'custom', title: '阅读数', width: '80px' },
        { field: 'cover', title: '封面图', width: '150px', img: 'cover' },
        { field: 'status', title: '发布状态', switch: 'handleStatus', inactive: 0, active: 1, width: '80px' },
        { field: 'createTime', title: '创作时间' },
        { field: 'updateTime', title: '更新时间' },
        { field: 'toolbar', title: '操作', width: '250px' }
      ],
      toolbarList: [{ title: '置顶评论', field: 'handleComment', type: 'success' }, {
        title: '编辑',
        field: 'handleEdit',
        type: 'primary'
      }, { title: '删除', field: 'handleDel', type: 'danger' }],
      total: 0,
      tableControl: true,
      alterVisible: false,
      form: { commentContent: '' }
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.search({ page: 1, article_title: '' });
    });
  },
  methods: {
    search(k) {
      k && (this.listQuery.page = k.page);
      this.loading = true;
      list(this.listQuery).then(res => {
        this.list = res.list;
        this.total = res.total;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleEdit(data) {
      this.$router.push({
        name: 'Write',
        query: {
          id: data.id
        }
      });
    },
    handleAdd() {
      this.$router.push({
        name: 'Write'
      });
    },
    handleComment(item) {
      this.form.articleId = item.id;
      this.form.articleName = item.articleTitle;
      this.form.commentContent = '';
      this.form.author = 1;
      this.form.status = 1;
      this.alterVisible = true;
    },
    ok() {
      if (!this.form.commentContent) {
        this.$message.error('内容不能为空');
      }
      add(this.form).then(() => {
        this.alterVisible = false;
      });
    },
    handleStatus(data) {
      this.loading = true;
      publish({ id: data.id, status: data.status }).then(() => {
        this.loading = false;
      }).catch(() => {
        this.search();
      });
    },
    handleDel(data) {
      this.$confirm('确认删除么?', '提示', {
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
      });
    }
  }
};
</script>
<style scoped>
</style>

