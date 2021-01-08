<template>
  <div class="app-container">
    <!-- 新增 -->
    <el-dialog :title="form.id ? '编辑': '添加'" :visible.sync="visible" width="40%" :before-close="closeDialog">
      <el-form ref="form" :model="form" label-width="110px" :rules="rules">
        <el-form-item label="名称" prop="menu_name">
          <el-input v-model.trim="form.menuName" clearable />
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="form.menuType" @change="handleChangeType">
            <el-radio v-for="(k,i) in types" :key="i" :label="i">{{ k }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.menuType ===1" label="路由地址" prop="pageUrl">
          <el-input v-model.trim="form.pageUrl" placeholder="请输入4~16位纯英文" clearable :disabled="form.id !==undefined" />
        </el-form-item>
        <el-form-item v-if="form.menuType === 2" label="权限" prop="url">
          <el-input v-model.trim="form.url" placeholder="请输入权限" clearable />
        </el-form-item>
        <el-form-item label="序号" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="1" label="序号" />
        </el-form-item>
        <el-form-item v-if="form.menuType !==0" label="父节点">
          <el-input v-model="form.parentName" readonly placeholder="点击选择" @focus="treeVisible = true" />
        </el-form-item>
        <el-form-item v-if="form.menuType !== 0" label="图标" prop="icon">
          <el-input v-model="form.icon" class="chooseIcon" clearable @click.native="svgVisible = true" />
          <div v-if="form.icon" class="icon-box">
            <svg-icon :icon-class="form.icon" />
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model.trim="form.remark" />
        </el-form-item>
        <div class="center">
          <el-button type="primary" size="medium " @click="onSubmit">立即提交</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!--    菜单树-->
    <el-dialog title="选择菜单" :visible.sync="treeVisible" width="300px">
      <el-tree
        :data="list"
        :props="defaultProps"
        accordion
        @node-click="handleNodeClick"
      />
    </el-dialog>
    <el-dialog v-if="svgVisible" :visible.sync="svgVisible">
      <svg-list :list="svg" @setIcon="setIcon" />
    </el-dialog>
  </div>
</template>

<script>
  import { menu } from '@/api/menu';
  import { getSvg, types } from './config';
  import SvgList from './svg-list';

  export default {
    name: 'Menu',
    components: { SvgList },
    props: {
      visible: {
        type: Boolean,
        default() {
          return false;
        }
      },
      info: {
        type: Object,
        default() {
          return null;
        }
      },
      list: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'menuName'
        },
        rules: {
          menuName: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          pMenuId: [
            { required: true, message: '请选择父节点', trigger: 'blur' }
          ]
        },
        types,
        svg: [],
        treeVisible: false,
        svgVisible: false,
        form: {
          note: '',
          menuName: '',
          pageUrl: '',
          url: '',
          pMenuId: 0,
          parentName: '',
          sort: '',
          menuType: 0
        }
      };
    },
    created() {
      this.getSvg();
      if (this.info) {
        this.form = { ...this.info };
        delete this.form.children;
      }
    },
    methods: {
      handleChangeType() {
        this.$refs.form.clearValidate();
        if (!this.form.id) {
          this.form.parentName = '';
          this.form.parentId = 0;
        }
      },
      setIcon(icon) {
        this.form.icon = icon;
        this.svgVisible = false;
      },
      closeDialog(refresh) {
        this.$emit('close', refresh);
      },
      getSvg,
      handleNodeClick(data) {
        if (data.menuType === 0) {
          this.$message.error('父节点不能是按钮');
          return;
        }
        if (data.menuType === 1 && this.form.menuType === 1) {
          this.$message.error('菜单的父节点只能是目录');
          return;
        }
        if (data.menuType === 2 && this.form.menuType === 0) {
          this.$message.error('按钮的父节点只能是菜单');
          return;
        }
        this.form.parentName = data.menuName;
        this.form.pMenuId = data.id;
        this.treeVisible = false;
      },
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.form.menuType > 0 && this.form.pMenuId === 0) {
              this.$message.error('请指定父节点');
              return;
            }
            menu(this.form.id ? 'edit' : 'add', this.form).then(() => {
              this.closeDialog(1);
            });
          }
        });
      }
    }
  };
</script>
<style lang="scss">
  .mod-menu {
    .menu-list__input,
    {
      > .el-input__inner {
        cursor: pointer;
      }
    }
  }

  .chooseIcon {
    width: 200px !important;
  }
</style>

