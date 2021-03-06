<template>
  <div class="app-container">
    <!-- 表格查询条件 -->
    <div class="filter-container">
      <el-input v-model.trim.trim="listQuery.userName" placeholder="账号..." style="width: 200px;" clearable />
      <el-button type="primary" class="filter-item" @click="search()">查询</el-button>
      <el-button type="primary" class="filter-item" @click="handleAdd()">添加</el-button>
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
    <!-- 新增/编辑-->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="600px">
      <el-form ref="form" :model="form" label-width="100px" size="mini" :rules="rules">
        <el-form-item v-if="title==='添加'" label="账号" prop="userName">
          <el-input v-model.trim="form.userName" placeholder="长度4至20位，以字母开头，字母，数字，减号，下划线" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="form.password" show-password placeholder="长度6至18位" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model.trim="form.nickName" />
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model.trim="form.userEmail" placeholder="邮箱格式示例：123@qq.com" />
        </el-form-item>
        <el-form-item label="手机号码" prop="userTelephoneNumber">
          <el-input v-model.trim="form.userTelephoneNumber" placeholder="长度11位" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <ImgUpLoad :img="form.avatar" :title="form.userName" @setImg="setIcon" />
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select ref="role" v-model="form.roleId" placeholder="选择用户角色" clearable class="filter-item">
            <el-option v-for="(v, k,i) in roles" :key="i" :label="v" :value="k" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="form.remark" />
        </el-form-item>
        <el-form-item class="center">
          <el-button v-preventReClick type="primary" :loading="reqLoading" size="medium " @click="onSubmit">立即提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 分页 -->
    <nice-pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="search" />
  </div>
</template>

<script>
import { list, signup, del, edit, onOff, getRoles } from '@/api/users'; // 引入函数
import ImgUpLoad from '@/views/common/imgUpload';
import md5 from 'md5';

export default {
  name: 'Users',
  components: { ImgUpLoad },
  data() {
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        // 合法的手机号码
        return cb();
      }
      cb(new Error('手机号码格式不正确'));
    };
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }
      cb(new Error('请输入合法的邮箱'));
    };
    return {
      rules: {
        userName: [{ required: true, trigger: 'blur' }, {
          min: 4,
          max: 20,
          message: '长度4至20位，以字母开头，字母，数字，减号，下划线',
          trigger: "blur"
        }],
        password: [{ required: true, message: '必填项', trigger: 'blur' }, {
          min: 6, max: "18", message: '密码长度为6-18位英文/数字/特殊符号', trigger: "blur"
        }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
        userEmail: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { validator: checkEmail, trigger: "blur" }],
        userTelephoneNumber: [{ required: true, message: '请输入手机号码', trigger: 'blur' }, {
          validator: checkMobile,
          trigger: "blur"
        }]
      },
      form: {
        id: '',
        userName: '',
        nickName: '',
        userEmail: '',
        userTelephoneNumber: '',
        roleId: '',
        remark: '',
        status: 0,
        password: '',
        avatar: ''
      },
      roles: {},
      dialogVisible: false,
      reqLoading: false,
      list: [],
      listQuery: { page: 1, userName: '' },
      loading: false,
      tableHeader: [
        { field: 'userName', sortable: 'custom', title: '账号' },
        { field: 'nickName', sortable: 'custom', title: '昵称' },
        { field: 'userEmail', sortable: 'custom', title: '邮箱' },
        { field: 'userTelephoneNumber', sortable: 'custom', title: '手机号码' },
        { field: 'avatar', title: '头像', width: '200px', img: 'avatar' },
        { field: 'status', title: '账号启禁', switch: 'handleStatus', inactive: 1, active: 0 },
        { field: 'roleId', title: '角色', formatter: 'roleId' },
        { field: 'updateTime', title: '更新时间' },
        { field: 'remark', title: '备注' },
        { field: 'toolbar', title: '操作', width: '200px' }
      ],
      toolbarList: [{ title: '编辑', field: 'handleEdit', type: 'primary' }, {
        title: '删除',
        field: 'handleDel',
        type: 'danger'
      }],
      total: 0,
      title: '添加',
      tableControl: true
    };
  },
  created() { // 组件创建的时候
    getRoles().then(res => {
      res.map(item => {
        this.roles[item.id] = item.roleName;
      });
    });
    this.search(); // 调用查询列表的函数
  },
  methods: {
    formatter(row, field) {
      return this.roles[row[field]];
    },
    setIcon(url) {
      this.form.avatar = url;
    },
    search(k) {
      this.loading = true;
      k && (this.listQuery.page = k.page);
      list(this.listQuery).then(res => { // 请求后台接口
        this.list = res.list;
        this.total = res.total;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.title !== '添加' ? this.editReq() : this.addReq();
        }
      });
    },
    editReq() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
      });
      this.reqLoading = true;
      const param = { ...this.form };
      if (param.password) {
        param.password = md5(param.password);
      }
      edit(param).then(() => {
        this.reqLoading = false;
        this.dialogVisible = false;
        this.search();
      }).catch(() => {
        this.reqLoading = false; x;
      });
    },
    addReq() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
      });
      this.reqLoading = true;
      const param = { ...this.form };
      param.password = md5(param.password);
      signup(param).then(res => {
        this.reqLoading = false;
        this.dialogVisible = false;
        this.search();
      }).catch(() => {
        this.reqLoading = false;
      });
    },
    handleEdit(data) {
      this.title = '编辑 -  ' + data.userName;
      this.dialogVisible = true;
      this.form.id = data.id;
      for (const i in this.form) {
        this.form[i] = data[i];
      }
      this.form.roleId = String(data.roleId);
    },
    handleAdd() {
      this.form = { ...{}, ...this.$options.data().form };
      this.title = '添加';
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    handleStatus(data) {
      this.loading = true;
      onOff(data).then(() => {
        this.loading = false;
      }).catch(() => {
        this.search();
      });
    },
    handleDel(data) {
      if (data.status) {
        this.$message.error('删除前请先禁用它！');
        return;
      }
      this.$confirm('确认删除么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        del({ id: data.id }).then(() => {
          this.search();
          this.loading = false;
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

