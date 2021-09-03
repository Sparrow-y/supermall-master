<template>
  <div class="category">
    <nav-bar class="nav-bar"> <div slot="center">商品分类</div></nav-bar>
    <div class="category-content">
      <scroll class="content" ref="scroll" :probeType="3" :pull-up-load="true">
        <tab-menu :categories="categories" @selectItem="selectItem"></tab-menu>
      </scroll>
      <scroll
        class="tab-content"
        ref="scroll"
        :probe-type="3"
        :pull-up-load="true"
        @pullingUp="loadMore"
      >
        <div>
          <tab-content-category
            :subcategories="showSubcategory"
          ></tab-content-category>
          <tab-control
            :titles="['综合', '新品', '销量']"
            @tabClick="tabClick"
          ></tab-control>
          <tab-content-detail
            :category-detail="showCategoryDetail"
          ></tab-content-detail>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import Scroll from "components/common/scroll/Scroll";

import TabControl from "components/content/tabControl/TabControl";

import TabMenu from "./childComps/TabMenu";
import TabContentDetail from "./childComps/TabContentDetail";
import TabContentCategory from "./childComps/TabContentCategory";
import {
  getCategory,
  getSubcategory,
  getCategoryDetail,
} from "network/category";

import { POP, SELL, NEW } from "@/common/const";
import { tabControlMixin } from "@/common/mixin";

export default {
  name: "Category",
  mixins: [tabControlMixin],
  data() {
    return {
      categories: [],
      categoryData: {},
      currentIndex: -1,
      getThemeTopY: null,
    };
  },
  components: {
    Scroll,
    NavBar,
    TabMenu,
    TabContentCategory,
    TabControl,
    TabContentDetail,
  },
  computed: {
    showSubcategory() {
      if (this.currentIndex === -1) return {};
      return this.categoryData[this.currentIndex].subcategories;
    },
    showCategoryDetail() {
      if (this.currentIndex === -1) return [];
      return this.categoryData[this.currentIndex].categoryDetail[
        this.currentType
      ];
    },
  },
  created() {
    // 请求数据
    this._getCategory();
    // 监听goodsitem中图片加载完成
    this.$bus.$on("itemImageLoad", () => {
      this.$refs.scroll.refresh();
    });
  },
  methods: {
    _getCategory() {
      getCategory().then((res) => {
        // 1.获取分类数据
        this.categories = res.data.category.list;
        // 2.初始化每个类别的子数据
        for (let i = 0; i < this.categories.length; i++) {
          this.categoryData[i] = {
            // 创建两个对象用于保存数据
            subcategories: {},
            categoryDetail: {
              pop: [],
              new: [],
              sell: [],
            },
          };
        }
        // 3.请求第一个分类的数据
        this._getSubcategories(0);
      });
    },
    _getSubcategories(index) {
      this.currentIndex = index;
      const mailKey = this.categories[index].maitKey;
      getSubcategory(mailKey).then((res) => {
        // 将data添加到subcayegories中
        this.categoryData[index].subcategories = res.data;
        this.categoryData = { ...this.categoryData };
        this._getCategoryDetail(POP);
        this._getCategoryDetail(SELL);
        this._getCategoryDetail(NEW);
      });
    },
    _getCategoryDetail(type) {
      // 1.获取请求的miniWallkey
      const miniWallkey = this.categories[this.currentIndex].miniWallkey;
      // 2.发送请求,传入miniWallkey和type
      getCategoryDetail(miniWallkey, type).then((res) => {
        // 3.将获取的数据保存下来
        this.categoryData[this.currentIndex].categoryDetail[type] = res;
        this.categoryData = { ...this.categoryData };
      });
    },
    /**
     * 事件响应相关的方法
     */
    selectItem(index) {
      this._getSubcategories(index);
    },
    // 图片加载完成刷新
    imageLoad() {
      this.$refs.scroll.refresh();
      this.getThemeTopY();
    },
    // 上拉加载更多
    loadMore() {
      console.log("加载更多");
    },
  },
};
</script>

<style scoped>
.category {
  position: relative;
  background-color: #fff;
  height: 100vh;
}
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
  font-weight: 700;
  /* overflow-y: scroll; */
}

.category-content {
  display: flex;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
  overflow: hidden;
}
.tab-content {
  flex: 1;
  bottom: 49px;
}
</style>
