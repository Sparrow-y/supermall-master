<template>
  <div class="detail">
    <detail-nav-bar class="detail-nav-bar" @titleClick="titleClick" ref="nav" />
    <scroll
      class="content"
      ref="scroll"
      @scroll="contentScroll"
      :probe-type="3"
    >
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info
        :detail-info="detailInfo"
        @imageLoad="imageLoad"
      ></detail-goods-info>
      <detail-param-info ref="param" :paramInfo="paramsInfo" />
      <detail-comment-info ref="comment" :commentInfo="commentInfo" />
      <detail-recommend-info
        ref="recommend"
        :recommends="recommends"
      ></detail-recommend-info>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <!-- <toast :message="message" :isShow="isShow"></toast> -->
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailRecommendInfo from "./childComps/DetailRecommendInfo";
import DetailBottomBar from "./childComps/DetailBottomBar.vue";

import Scroll from "components/common/scroll/Scroll";
// import Toast from "components/common/toast/Toast";
import GoodsList from "components/content/goods/GoodsList";
import { debounce } from "@/common/utils";
import { BACKTOP_DISTANCE } from "@/common/const";
import { backTopMixin } from "@/common/mixin";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend,
} from "network/detail";
// import { mapActions } from "vuex";

export default {
  name: "Detail",
  mixins: [backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramsInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopY: [],
      getThemeTopY: null,
      currentIndex: 0,
      //   message: "",
      //   isShow: false,
    };
  },
  components: {
    Scroll,
    GoodsList,
    DetailNavBar,
    DetailSwiper,
    DetailShopInfo,
    DetailBaseInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailRecommendInfo,
    DetailBottomBar,
    // Toast,
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid;

    // 2.根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      const data = res.result;
      // 1.获取顶部图片轮播数据
      this.topImages = res.result.itemInfo.topImages;

      // 2.获取商品信息
      // 通过一个类将一些复杂的数据整合到一起
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );
      // 3.获取店铺信息
      this.shop = new Shop(data.shopInfo);

      // 4.获取详情图片
      this.detailInfo = data.detailInfo;

      // 5.获取参数信息
      this.paramsInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      // 6.获取评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }

      //
    });

    // 3.请求推荐数据
    getRecommend().then((res) => {
      this.recommends = res.data.list;
    });
    this.getThemeTopY = debounce(() => {
      this.themeTopY = [];
      this.themeTopY.push(0);
      this.themeTopY.push(this.$refs.param.$el.offsetTop);
      this.themeTopY.push(this.$refs.comment.$el.offsetTop);
      this.themeTopY.push(this.$refs.recommend.$el.offsetTop);
    });
  },
  mounted() {},
  updated() {},
  methods: {
    // ...mapActions(["addCart"]),
    imageLoad() {
      this.$refs.scroll.refresh();
      this.getThemeTopY();
    },
    // 点击标题，滚动到相应位置
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopY[index], 500);
    },
    // 监听位置
    contentScroll(position) {
      // 1.获取y值
      const positionY = -position.y;
      // 2.对比
      for (let i = 0; i < this.themeTopY.length; i++) {
        if (
          this.currentIndex !== i &&
          ((i < this.themeTopY.length - 1 &&
            positionY > this.themeTopY[i] &&
            positionY < this.themeTopY[i + 1]) ||
            (i === this.themeTopY.length - 1 && positionY > this.themeTopY[i]))
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
      // 是否显示回到顶部
      this.isShowBackTop = -position.y > BACKTOP_DISTANCE;
    },
    // 添加购物车
    addToCart() {
      // 1.获取需要展示的数据
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.nowprice = this.goods.nowPrice;
      product.iid = this.iid;
      // 2.添加购物车
      // dispatch后actions返回Promise
      // 在vuex中完成操作后，返回一个promise对象，用来完成其他操作
      this.$store.dispatch("addCart", product).then((res) => {
        // this.isShow = true;
        // this.message = res;
        // setTimeout(() => {
        //   this.isShow = false;
        //   this.message = "";
        // }, 1500);
        // console.log(res);
        this.$toast.isShow(res, 1500);
      });
      // 3.添加购物车成功
    },
  },
};
</script>

<style scoped>
.detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
  width: 100%;
}
.detail-nav-bar {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content {
  position: absolute;
  top: 44px;
  bottom: 60px;
}
</style>