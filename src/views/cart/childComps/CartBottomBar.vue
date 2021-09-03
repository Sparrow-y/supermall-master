<template>
  <div class="bottom-bar">
    <div class="select">
      <check-button
        class="button"
        :is-checked="isSelectAll"
        @click.native="checkClick"
      ></check-button>
      <span>全选</span>
    </div>
    <div class="total">合计：{{ totalPrice }}</div>
    <div class="calculate" @click="calcClick">去计算({{ checkedLength }})</div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";
import { mapGetters } from "vuex";

export default {
  name: "CartBottomBar",
  components: {
    CheckButton,
  },
  computed: {
    ...mapGetters(["cartList", "ch"]),
    totalPrice() {
      return (
        "￥" +
        this.cartList
          .filter((item) => {
            return item.checked;
          })
          .reduce((preValue, item) => {
            return preValue + item.nowprice * item.count;
          }, 0)
      );
    },
    checkedLength() {
      return this.cartList.filter((item) => {
        return item.checked;
      }).length;
    },
    isSelectAll() {
      // 1.使用filter
      //   return !this.cartList.filter((item) => {
      //     !item.checked;
      //   }).length;
      // 2.
      //   return this.cartList.length == this.checkedLength;
      // 3.find
      if (this.cartList.length === 0) return false;
      return !this.cartList.find((item) => !item.checked);
      // 4.普通遍历
      //   for (let item of this.cartList) {
      //     if (!this.checked) {
      //       return false;
      //     }
      //   }
      //   return true;
    },
  },
  methods: {
    checkClick() {
      if (this.isSelectAll) {
        this.cartList.forEach((item) => {
          item.checked = false;
        });
      } else {
        this.cartList.forEach((item) => {
          item.checked = true;
        });
      }
    },
    calcClick() {
      if (this.cartList.every((item) => !item.checked)) {
        this.$toast.isShow("请选择商品", 2000);
      }
    },
  },
};
</script>

<style scoped>
.bottom-bar {
  background-color: #ececec;
  position: fixed;
  display: flex;
  height: 40px;
  left: 0;
  right: 0;
  bottom: 49px;
}
.select {
  display: flex;
  align-items: center;
  width: 70px;
  height: 100%;
  position: relative;
  left: 4px;
}
.button {
  width: 20px;
  height: 20px;
}
.select span {
  line-height: 40px;
  margin-left: 5px;
}
.total {
  flex: 1;
  line-height: 40px;
  font-size: 15px;
  margin-left: 10px;
}
.calculate {
  width: 80px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  background-color: rgb(247, 9, 9);
}
</style>