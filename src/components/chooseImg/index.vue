<template>
  <el-drawer title="媒体库" :visible.sync="drawer">
    <div style="display:flex;justify-content:space-around;flex-wrap:wrap;padding-top:40px">
      <el-image
        v-for="(item,key) in picList"
        :key="key"
        class="header-img-box-list"
        :src="item.imageUrl"
        :title="item.imageTitle"
        @click.native="chooseImg(item.imageUrl,target,targetKey)"
      >
        <div slot="error" class="header-img-box-list">
          <i class="el-icon-picture-outline" />
        </div>
      </el-image>
    </div>
  </el-drawer>
</template>

<script>
import { findImagesList } from "@/api/images";

export default {
  props: {
    target: [Object],
    targetKey: [String]
  },
  data() {
    return {
      drawer: false,
      picList: []
    };
  },
  methods: {
    chooseImg(url, target, targetKey) {
      if (target && targetKey) {
        target[targetKey] = url;
      }
      this.$emit("enter-img", url);
      this.drawer = false;
    },
    async open() {
      findImagesList().then(res => {
        this.picList = res;
        this.drawer = true;
      });
    }
  }
};
</script>

<style lang="scss">
.header-img-box-list {
  width: 180px;
  height: 180px;
  border: 1px dashed #ccc;
  border-radius: 20px;
  text-align: center;
  line-height: 180px;
  cursor: pointer;
}
</style>
