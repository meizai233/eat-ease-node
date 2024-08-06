import AddressComponent from "@prototype/AddressComponent";
import ShopModel from "@models/shopping/shop";
// routes -> 对应功能controller的函数（中间件）-> 对应Model里的crud函数

class Shop extends AddressComponent {
  constructor() {
    super();
    this.addShop = this.addShop.bind(this);
    this.getRestaurants = this.getRestaurants.bind(this);
  }

  async addShop(req, res, next) {
    let restaurant_id;
    try {
      // 获取餐馆id?
      restaurant_id = await this.getId("restaurant_id");
    } catch (err) {
      console.log("获取商店id失败");
      res.send({
        type: "ERROR_DATA",
        message: "获取数据失败",
      });
      return;
    }
  }

  // 获取餐馆列表
  async getRestaurants(req, res, next) {
    const { latitude, longitude, offset = 0, limit = 20, keyword, restaurant_category_id, order_by, extras, delivery_mode, restaurant_category_ids } = req.query;

    // 待办 总觉得参数校验可以统一兜底。。。 比如{参数}错误
    try {
      if (!latitude) {
        throw new Error("latitude参数错误");
      } else if (!longitude) {
        throw new Error("longitude参数错误");
      }
    } catch (err) {
      console.log("latitude,longitude参数错误");
      res.send({
        status: 0,
        type: "ERROR_PARAMS",
        message: err.message,
      });
      return;
    }

    const restaurants = await ShopModel.find({}, "-_id").limit(Number(limit)).skip(Number(offset));
    const from = latitude + "," + longitude;
    let to = "";
    restaurants.forEach((item, index) => {
      const slpitStr = index == restaurants.length - 1 ? "" : "|";
      to += item.latitude + "," + item.longitude + slpitStr;
    });
    try {
      const positionArr = await this.getDistance(from, to);
      restaurants.map((item, index) => {
        return Object.assign(item, positionArr[index]);
      });
      res.send(restaurants);
    } catch (err) {
      console.log("err", err);
      res.send({
        status: 0,
        type: "ERROR_DATA",
        message: "获取数据失败",
      });
    }
  }
}
export default new Shop();
