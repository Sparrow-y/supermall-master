<template>
  <!-- ref一般绑定给子组件 -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0,
    },
    pullUpLoad: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scroll: null,
    };
  },
  mounted() {
    // 1.创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad,
    });
    // 2.实时监听滚动的位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on("scroll", (position) => {
        // 发出事件，让父组件进行操作,因为父组件才是真正用到的地方
        this.$emit("scroll", position);
      });
    }
    this.scroll.refresh();
    // 3.监听上拉加载事件
    if (this.pullUpLoad) {
      this.scroll.on("pullingUp", () => {
        this.$emit("pullingUp");
      });
    }
  },
  methods: {
    scrollTo(x, y, time = 500) {
      this.scroll.scrollTo(x, y, time);
    },
    /**
     * finishPullUp: 这个类似控制一个开关，比如在触发pullingUp事件的时候，插件肯定会把一个开关给关掉，防止用户重复上拉
     *	在数据加载完成以后，需要执行finishPullUp()把开关打开，以便下次可以继续执行上拉刷新；
     */
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp && this.scroll.finishPullUp();
    },
    /**
	 * refresh() {
      this.scroll.refresh();
    },
	 */
    refresh() {
      this.scroll && this.scroll.refresh && this.scroll.refresh();
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0;
    },
  },
};
</script>

<style scoped>
</style>