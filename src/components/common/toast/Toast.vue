<template>
  <div class="toast" v-show="show">
    <div>{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: "Toast",
  //   props: {
  //     message: {
  //       type: String,
  //       default: "",
  //     },
  //     isShow: {
  //       type: Boolean,
  //       default: false,
  //     },
  //   },
  data() {
    return {
      message: "",
      show: false,
    };
  },
  methods: {
    isShow(message = "默认文字", duraction = 1500) {
      this.show = true;
      this.message = message;
      setTimeout(() => {
        this.show = false;
        this.message = "";
      }, duraction);
    },
  },
};
</script>

<style scoped>
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  padding: 6px 8px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  z-index: 999;
}
</style>