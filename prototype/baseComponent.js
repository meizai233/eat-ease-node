// import fetch from "node-fetch";
// import Ids from "../models/ids";

export default class BaseComponent {
  constructor() {
    this.idList = ["restaurant_id", "food_id", "orderId", "user_id", "address_id", "cart_id", "img_id", "category_id", "item_id", "sku_id"];
    this.imgTypeList = ["shop", "food", "avatar", "default"];
    // 待办 这啥
    // this.uploadImg = this.uploadImg.bind(this)
  }

  // 获取id列表
  async getId(type) {
    if (!this.idList.includes(type)) {
      console.log("id类型错误");
      throw new Error("id类型错误");
      return;
    }
    try {
      const idData = await Ids.findOne();
      idData[type]++;
      await idData.save();
      return idData[type];
    } catch (err) {
      console.log("获取ID数据失败");
      throw new Error(err);
    }
  }
}
