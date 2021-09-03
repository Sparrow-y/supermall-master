export default {
  addCart(context, payload) {
    // payload是新添加的商品
    // 先判断有没有这个商品
    return new Promise((resolve, reject) => {
      let oldProduct = null;
      for (let item of context.state.cartList) {
        if (item.iid === payload.iid) {
          oldProduct = item;
        }
      }
      if (oldProduct) {
        // oldProduct.count++;
        context.commit("addCount", oldProduct);
        resolve("添加成功");
      } else {
        context.commit("addCart", payload);
        // state.cartList.push(payload);
        resolve("添加了新商品");
      }
    });
    // indexOf方法
    //   let index = state.cartList.indexOf(payload)
    //   if (index ===-1) {
    // 	  let oldProduct  = null;
    // 	  oldProduct.count = 1
    //   }
    // find()方法
    //   let oldProduct = state.cartList.find(item => item.iid === payload.iid);
    //   if (oldProduct) {
    //     oldProduct.count += 1;
    //     state.cartList.push(payload);
    //   } else {
    //     payload.count = 1;
    //     state.cartList.push(payload);
    //   }
  }
};
