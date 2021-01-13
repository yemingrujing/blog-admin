<template>
  <div class="app-container">
    <!-- 表格查询条件 -->
    <div class="filter-container">
      <el-input v-model.trim="listQuery.tagName" placeholder="标签名称" style="width: 200px;" clearable />
      <el-button type="primary" class="filter-item" @click="search">查询</el-button>
      <el-button type="primary" class="filter-item" @click="add">添加</el-button>
    </div>
    <!-- 表格区域 -->
    <nice-table
      :table-header="tableHeader"
      :list="list"
      :toolbar-list="toolbarList"
      :list-loading="loading"
      @emitEvent="(args)=>this.$emitEvent(args)"
    />
    <el-dialog :title="title" :visible.sync="alterVisible" width="20%">
      <el-form ref="role" :model="form" label-width="80px" label-position="left" :rules="rules">
        <el-form-item label="分类名称" prop="tagName">
          <el-input v-model.trim="form.tagName" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="别名" prop="tagAlias">
          <el-input v-model.trim="form.tagAlias" placeholder="请输入别名" />
        </el-form-item>
        <el-form-item label="描述" prop="tagDescription">
          <el-input v-model.trim="form.tagDescription" placeholder="请输入描述信息" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alterVisible = false">取 消</el-button>
        <el-button type="primary" @click="ok()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="所属文章" :visible.sync="searchVisible">
      <el-table
        v-loading="articleLoading"
        :data="articleData"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        style="width: 100%"
      >
        <el-table-column property="articleTitle" label="标题" />
        <el-table-column property="categoryName" label="分类" />
        <el-table-column property="tagName" label="标签" />
        <el-table-column property="status" label="发布状态">
          <template slot-scope="scope">
            {{ scope.row.status ? '已发布' : '未发布' }}
          </template>
        </el-table-column>
        <el-table-column property="updateTime" label="更新时间" />
      </el-table>
    </el-dialog>
    <!-- 分页 -->
    <nice-pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="search" />
  </div>
</template>

<script>
import { belong, edit, add, del, search } from '@/api/tags';

export default {
  name: 'Tags',
  data() {
    return {
      rules: {
        tagName: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
        tagDescription: [{ required: true, message: '请输入描述信息', trigger: 'blur' }]
      },
      list: [],
      articleData: [],
      total: 0,
      loading: true,
      title: '',
      form: {},
      alterVisible: false,
      searchVisible: false,
      articleLoading: false,
      listQuery: { page: 1, tagName: '' },
      tableHeader: [
        { field: 'tagName', sortable: 'custom', title: '标签名' },
        { field: 'tagAlias', sortable: 'custom', title: '别名' },
        { field: 'tagDescription', sortable: 'custom', title: '描述', tooltip: true },
        { field: 'createTime', title: '创建时间' },
        { field: 'toolbar', title: '操作' }
      ],
      toolbarList: [{ title: '编辑', field: 'handleEdit', type: 'primary' }, {
        title: '查看所属文章',
        field: 'handleShow',
        type: 'success'
      }, { title: '删除', field: 'handleDel', type: 'danger' }]
    };
  },
  created() {
    this.search();
  },
  methods: {
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
    handleEdit(data) {
      this.title = '编辑标签';
      this.alterVisible = true;
      this.form = {
        tagName: data.tagName,
        tagAlias: data.tagAlias,
        tagDescription: data.tagDescription,
        id: data.id
      };
    },
    handleShow(data) {
      this.searchVisible = true;
      this.articleLoading = true;
      belong({ tagId: data.id }).then(res => {
        this.articleLoading = false;
        this.articleData = res;
        this.alterVisible = false;
      }).catch(() => {
        this.articleLoading = false;
      });
    },
    ok() {
      if (!this.form.tagName || !this.form.tagDescription) {
        return;
      }
      this.form.id ? edit(this.form).then(res => {
        this.search();
        this.alterVisible = false;
      }) : add(this.form).then(res => {
        this.search();
        this.alterVisible = false;
      });
    },
    add() {
      this.alterVisible = true;
      this.form = { tagName: '', tagAlias: '', tagDescription: '' };
      this.title = '新增标签';
    },
    handleDel(data) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        del({ id: data.id }).then(res => {
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
