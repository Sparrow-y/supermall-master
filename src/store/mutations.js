export default {
  addCount(state, payload) {
    payload.count++;
  },
  addCart(state, payload) {
    payload.checked = true;
    payload.count = 1;
    state.cartList.push(payload);
  }
  //   checkChange(state, payload) {
  //     payload.checked = !payload.checked;
  //   }
};
