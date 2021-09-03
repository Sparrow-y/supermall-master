<template>
  <div class="cart-list">
    <cart-listitem
      v-for="(item, index) in cartList"
      :key="index"
      :item-info="item"
    ></cart-listitem>
  </div>
</template>

<script>
import CartListitem from "./CartListitem";

import { mapGetters } from "vuex";
export default {
  name: "CartList",
  computed: {
    ...mapGetters(["cartList"]),
  },
  components: {
    CartListitem,
  },
};
</script>

<style scoped>
</style>