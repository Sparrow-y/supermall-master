<template>
  <div id="tab-menu">
    <div
      class="menu-list"
      :class="{ active: index === currentindex }"
      v-for="(item, index) in categories"
      :key="index"
      @click="itemClick(index)"
    >
      {{ item.title }}
    </div>
  </div>
</template>

<script>
export default {
  name: "TabMenu",
  data() {
    return {
      currentindex: 0,
    };
  },
  props: {
    categories: {
      type: Array,
      default: [],
    },
  },
  methods: {
    itemClick(index) {
      this.currentindex = index;
      // 根据index选择要展示的数据
      this.$emit("selectItem", index);
    },
  },
};
</script>

<style scoped>
#tab-menu {
  width: 100px;
  background-color: #f6f6f6;
}
.menu-list {
  height: 45px;
  line-height: 45px;
  text-align: center;
  font-size: 14px;
}
.menu-list.active {
  font-weight: 700;
  color: var(--color-high-text);
  background-color: #fff;
  border-left: 3px solid var(--color-high-text);
}
</style>