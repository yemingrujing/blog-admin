<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select ref="role" v-model="listQuery.typeName" clearable class="filter-item" placeholder="选择类型">
        <el-option v-for="(v, k,i) in types" :key="i" :label="v" :value="k" />
      </el-select>
      <el-button type="primary" class="filter-item" @click="add">添加</el-button>
    </div>
    <el-dialog :title="title" :visible.sync="alterVisible" width="500px">
      <el-form ref="poem" :model="form" label-width="80px" label-position="left">
        <el-form-item label="类型" prop="typeName">
          <el-select ref="typeName" v-model.trim="form.typeName" clearable class="filter-item" placeholder="选择类型">
            <el-option v-for="(v, k, i) in types" :key="i" :label="v" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item ref="author" label="来源" prop="author">
          <el-input v-model.trim="form.author" placeholder="请输入来源" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            ref="content"
            v-model.trim="form.content"
            type="textarea"
            :rows="4"
          />
        </el-form-item>
        <span slot="footer" class="dialog-footer">
          <el-button @click="alterVisible = false">取 消</el-button>
          <el-button type="primary" @click="ok()">确 定</el-button></span>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alterVisible = false">取 消</el-button>
        <el-button type="primary" @click="ok()">确 定</el-button></span>
    </el-dialog>
    <!-- 表格区域 -->
    <nice-table
      :table-header="tableHeader"
      :formatter="formatter"
      :list="list"
      :toolbar-list="toolbarList"
      :list-loading="loading"
      @emitEvent="(args)=>this.$emitEvent(args)"
    />
    <!-- 分页 -->
    <nice-pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="search" />
  </div>
</template>

<script>
import { del, search, add, edit } from '@/api/poem';

export default {
  name: 'Poem',
  data() {
    return {
      list: [],
      loading: true,
      form: {},
      alterVisible: false,
      listQuery: { page: 1, typeName: '', limit: 10 },
      total: 0,
      title: '',
      types: {
        a: '动画',
        b: '漫画',
        c: '游戏',
        d: '文学',
        e: '原创',
        f: '来自网络',
        g: '其他',
        h: '影视',
        i: '诗词',
        j: '网易云',
        k: '哲学',
        l: '抖机灵'
      },
      type: '',
      tableHeader: [
        { field: 'content', title: '内容' },
        { field: 'createTime', title: '创建时间' },
        { field: 'typeName', title: '类别', formatter: 'type_name' },
        { field: 'author', title: '来源' },
        { field: 'toolbar', title: '操作' }
      ],
      toolbarList: [
        { title: '编辑', field: 'handleEdit', type: 'primary' },
        { title: '删除', field: 'handleDel', type: 'danger' }
      ]
    };
  },
  watch: {
    'listQuery.typeName': {
      handler() {
        this.search();
      },
      deep: true
    }
  },
  created() {
    this.search();
    this.stateSearch();
  },
  methods: {
    formatter(row, field) {
      return this.types[row[field]];
    },
    search(k) {
      k && (this.listQuery.page = k.page);
      this.loading = true;
      search(this.listQuery).then(res => {
        this.loading = false;
        this.list = res.list;
        this.total = res.total;
      }).catch(() => {
        this.loading = false;
      });
    },
    stateSearch() {
    },
    add() {
      this.alterVisible = true;
      this.form = { content: '', typeName: '', author: '' };
      this.title = '新增一言';
    },
    ok() {
      if (!this.form.content || !this.form.typeName || !this.form.author) {
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
    handleEdit(data) {
      this.title = '编辑标签';
      this.alterVisible = true;
      this.form = {
        content: data.content,
        typeName: data.typeName,
        author: data.author,
        id: data.id
      };
    },
    handleDel(data) {
      this.loading = true;
      del({ id: data.id }).then(() => {
        this.search();
      }).catch(() => {
        this.loading = false;
      });
    }
  }
};
</script>

<style scoped>
</style>
