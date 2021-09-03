<template>
  <div id="home">
    <nav-bar class="home-bar">
      <div slot="center">购物商城</div>
    </nav-bar>
    <tab-control
      :titles="['流行', '新款', '精选']"
      class="tabcon"
      @tabClick="tabClick"
      ref="tabControl1"
      v-show="isTabFixed"
    />
    <scroll
      class="content"
      ref="scroll"
      :probeType="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <home-swiper
        :banners="banners"
        @swiperImageLoad="swiperImageLoad"
      ></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control
        :titles="['流行', '新款', '精选']"
        class="tab-control"
        @tabClick="tabClick"
        ref="tabControl2"
      />
      <good-list :goods="showGoods" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";

import { getHomeMultidata, getHomeGoods } from "network/home";
import { BACKTOP_DISTANCE } from "@/common/const";
import { backTopMixin } from "@/common/mixin";

export default {
  name: "Home",
  mixins: [backTopMixin],

  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodList,
    Scroll,
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      // 当前类型
      currentType: "pop",
      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  created() {
    // 1.请求多个数据
    // this代表调用下面methods的函数（具体逻辑），而不是上面引入的（同名）

    this.getHomeMultidata();

    // 2.请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");

    // 3.监听goodsitem中图片加载完成
    this.$bus.$on("itemImageLoad", () => {
      this.$refs.scroll.refresh();
    });
  },
  mounted() {
    /**
	 * const refresh = this.debounce(this.$refs.scroll.refresh, 50);
    // 3.监听item中图片加载完成
    this.$bus.$on("itemImageLoad", () => {
      refresh();
    });
	 */
    // 这里拿到的是一个组件对象，而不是简单的div，所以没有offsetTop属性
    /**
	 * console.log(this.$refs.tabControl.$el.offsetTop);
    this.tabOffsetTop = this.$refs.tabControl.$el.offsetTop;
	 */
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY);
    this.$refs.scroll.refresh();
  },
  deactivated() {
    this.saveY = this.$refs.scroll.getScrollY();
  },
  methods: {
    /**
     * 事件监听相关的方法
     */

    tabClick(index) {
      //根据index判断传入的数据是哪些
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      // currentIndex记录点击的index
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },

    contentScroll(position) {
      // 1.巧妙的公式 判断topback的显示
      this.isShowBackTop = -position.y > BACKTOP_DISTANCE;

      // 2.决定tabControl是否吸顶（position :fixed）
      this.isTabFixed = -position.y > this.tabOffsetTop;
    },
    // 加载更多数据的方法
    loadMore() {
      // 请求数据
      this.getHomeGoods(this.currentType);
    },
    // 图片加载完成
    swiperImageLoad() {
      // 将获取到的offset赋值给定义好的tabOffsetTop
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    /**
     * 网络请求相关的方法
     */
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        // this.result = res;
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      // 调用一次后，page+1
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        // 把这个数组放到list数组中
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
        // 数据加载完后,调用finishiPullup,完成上拉加载更多
        this.$refs.scroll.finishPullUp();
      });
    },
  },
};
</script>

<style scoped>
#home {
  height: 100vh;
}
.home-bar {
  /* position: sticky;
  top: 0;*/
  z-index: 10;
  background-color: var(--color-tint);

  color: #fff;
  font-weight: 700;
}

/* .content {
  height: calc(100% - 93px);
  overflow: hidden;
} */
.content {
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
  overflow: hidden;
}
.tabcon {
  position: relative;
  z-index: 10;
}
</style>
