<template>
  <div class="recommend-info">
    <div class="info-header">热门推荐</div>
    <goods-list-item
      v-for="(item, index) in recommends"
      :key="index"
      :goodsItem="item"
    ></goods-list-item>
  </div>
</template>

<script>
import GridView from "components/common/gridView/GridView";
import GoodsListItem from "./GoodsListItem";

export default {
  name: "DetailRecommendInfo",
  components: {
    GridView,
    GoodsListItem,
  },
  props: {
    recommends: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style scoped>
.recommend-info {
  display: flex;
  /*让弹性盒元素在必要的时候拆行 */
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 5px;
}

.info-header {
  line-height: 40px;
  padding-left: 8px;
  font-size: 15px;
  color: #333;
  width: 100%;
}
</style>
