<template>
  <div class="write">
    <el-form ref="form" :inline="true" :model="form" label-width="120px" :rules="rules" size="medium">
      <el-form-item label="标题" prop="articleTitle">
        <el-input v-model.trim="form.articleTitle" style="width: 400px;" clearable />
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-select v-model="form.categoryId" placeholder="请选择分类" style="width: 100%" clearable>
          <el-option
            v-for="(item,k) in category"
            :key="k"
            :label="item.categoryName"
            :value="item.categoryId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="tagName">
        <el-select v-model="form.tagId" multiple placeholder="请选择标签" style="width: 400px;" clearable>
          <el-option
            v-for="(item,k) in tags"
            :key="k"
            :label="item.tagName"
            :value="item.tagId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="概述" prop="articleDes">
        <el-input
          v-model.trim="form.articleDes"
          :rows="4"
          type="textarea"
          maxlength="150"
          show-word-limit
          clearable
          style="width: 400px;"
        />
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <!--        <el-radio v-model="urlType" :label="0">手动输入</el-radio>-->
        <!--        <el-radio v-model="urlType" :label="1">上传</el-radio>-->
        <!--        <br>-->
        <!--        <ImgUpLoad v-if="urlType" :img="form.cover" :title="form.articleTitle" path="/blog/article/" @setImg="setImg" />-->
        <!--        <el-input v-else v-model.trim="form.cover" style="width: 200px;" clearable placeholder="图片路径..." />-->
        <div
          v-if="form.cover"
          class="user-headpic-update"
          :style="{ 'background-image': 'url(' + form.cover + ')','background-repeat':'no-repeat','background-size':'cover', 'background-position':'center',}"
        >
          <span class="update" @click="openChooseImg">
            <i class="el-icon-edit" />
            重新上传</span>
        </div>
        <ImgUpLoad
          v-else
          :img="form.cover"
          :title="form.articleTitle"
          path="/blog/article/"
          style="width: 200px;"
          @setImg="setImg"
        />
      </el-form-item>
      <el-form-item label="关键字" prop="keywords">
        <el-input
          v-model.trim="form.keywords"
          :rows="4"
          type="textarea"
          maxlength="64"
          show-word-limit
          style="width: 400px;height:100px"
          clearable
        />
      </el-form-item>
      <el-form-item label="文章目录">
        <el-switch
          v-model="form.tic"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="success" size="medium " @click="onSubmit(1)"><i class="el-icon-upload el-icon--right" />立即发布
        </el-button>
        <el-button type="primary" size="medium " icon="el-icon-edit" @click="onSubmit(0)">保存草稿</el-button>
      </el-form-item>
    </el-form>
    <ChooseImg ref="chooseImg" @enter-img="setImg" />
    <Markdown ref="markdown" :content="form.articleContent" />
  </div>
</template>

<script>
import Markdown from '@/components/Markdown/';
import { tags, category, detail, add, edit } from '@/api/write';
import ImgUpLoad from '@/views/common/imgUpload';
import ChooseImg from "@/components/chooseImg";

export default {
  name: 'Write',
  components: {
    Markdown,
    ImgUpLoad,
    ChooseImg
  },
  data() {
    return {
      tags: [],
      rules: {},
      category: [],
      urlType: 1,
      form: {
        articleContent: '',
        articleTitle: '',
        articleDes: '',
        categoryId: '',
        tagId: [],
        keywords: '',
        cover: '',
        tic: 1
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    setImg(url) {
      this.form.cover = url;
    },
    getMarkdown(content) {
      this.form.articleContent = content;
    },
    onSubmit(status) {
      this.form.status = status;
      this.form.articleContent = this.$refs.markdown.getMarkdown();
      const param = { ...this.form };
      if (this.form.id) {
        edit(param).then(() => {
          this.form = this.$options.data().form;
          this.$router.push('/blog/article');
        });
      } else {
        add(param).then(() => {
          this.form = this.$options.data().form;
          this.$router.push('/blog/article');
        });
      }
    },
    search(id) {
      if (!id) {
        return;
      }
      detail({ id }).then(res => {
        const buffer = new Buffer(res.articleContent);
        res.articleContent = buffer.toString();
        this.form = res;
      });
    },
    getList() {
      category().then(res => {
        this.category = res;
      });
      tags().then(res => {
        this.tags = res;
      });
    },
    openChooseImg() {
      this.$refs.chooseImg.open();
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.search(vm.$route.query.id);
    });
  }
};
</script>
<style scoped lang="scss">

.write {
  padding-top: 10px;
  background-color: #ffffff;
}

.user-headpic-update {
  width: 200px;
  height: 100px;
  line-height: 120px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  border-radius: 20px;

  &:hover {
    color: #fff;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.15) 100%), radial-gradient(at top center, rgba(255, 255, 255, 0.40) 0%, rgba(0, 0, 0, 0.40) 120%) #989898;
    background-blend-mode: multiply, multiply;

    .update {
      color: #fff;
    }
  }

  .update {
    width: 200px;
    height: 100px;
    text-align: center;
    color: transparent;
  }
}
</style>

