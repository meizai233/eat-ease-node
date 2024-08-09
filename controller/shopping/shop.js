import AddressComponent from "@prototype/AddressComponent";
import ShopModel from "@models/shopping/shop";
import CategoryHandle from "./category";
// routes -> 对应功能controller的函数（中间件）-> 对应Model里的crud函数

class Shop extends AddressComponent {
  constructor() {
    super();
    this.addShop = this.addShop.bind(this);
    this.getRestaurants = this.getRestaurants.bind(this);
    this.searchResaturant = this.searchResaturant.bind(this);
  }

  //添加商铺
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
  // 待办 排序 在前端还没有请求接口好像
  async getRestaurants(req, res, next) {
    const { latitude, longitude, offset = 0, limit = 20, keyword, restaurant_category_id, order_by, extras, delivery_mode = [], support_ids = [], restaurant_category_ids = [] } = req.query;

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

    let filter = {};
    //获取对应食品种类
    //  restaurant_category_ids 餐馆分类
    debugger;
    if (restaurant_category_ids.length && Number(restaurant_category_ids[0])) {
      const category = await CategoryHandle.findById(restaurant_category_ids[0]);
      Object.assign(filter, { category });
    }

    //按照距离，评分，销量等排序
    let sortBy = {};
    if (Number(order_by)) {
      switch (Number(order_by)) {
        case 1:
          // 起送价
          Object.assign(sortBy, { float_minimum_order_amount: 1 });
          break;
        case 2:
          // 按照距离 待办 看下schema是怎样
          Object.assign(filter, { location: { $near: [longitude, latitude] } });
          break;
        case 3:
          Object.assign(sortBy, { rating: -1 });
          break;
        case 5:
          Object.assign(filter, { location: { $near: [longitude, latitude] } });
          break;
        case 6:
          Object.assign(sortBy, { recent_order_num: -1 });
          break;
      }
    }

    //查找配送方式
    if (delivery_mode.length) {
      delivery_mode.forEach((item) => {
        if (Number(item)) {
          Object.assign(filter, { "delivery_mode.id": Number(item) });
        }
      });
    } //查找活动支持方式
    if (support_ids.length) {
      const filterArr = [];
      support_ids.forEach((item) => {
        if (Number(item) && Number(item) !== 8) {
          filterArr.push(Number(item));
        } else if (Number(item) == 8) {
          //品牌保证特殊处理
          Object.assign(filter, { is_premium: true });
        }
      });
      if (filterArr.length) {
        //匹配同时拥有多种活动的数据
        Object.assign(filter, { "supports.id": { $all: filterArr } });
      }
    }
    const restaurants = await ShopModel.find(filter, "-_id").sort(sortBy).limit(Number(limit)).skip(Number(offset));

    const from = latitude + "," + longitude;
    let to = "";
    //获取百度地图测局所需经度纬度

    restaurants.forEach((item, index) => {
      const slpitStr = index == restaurants.length - 1 ? "" : "|";
      to += item.latitude + "," + item.longitude + slpitStr;
    });
    try {
      if (restaurants.length) {
        //获取距离信息，并合并到数据中
        const distance_duration = await this.getDistance(from, to);
        restaurants.map((item, index) => {
          return Object.assign(item, distance_duration[index]);
        });
      }

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

  async searchResaturant(req, res, next) {
    const { geohash, keyword } = req.query;
    try {
      if (!geohash || geohash.indexOf(",") == -1) {
        throw new Error("经纬度参数错误");
      } else if (!keyword) {
        throw new Error("关键词参数错误");
      }
    } catch (err) {
      console.log("搜索商铺参数错误");
      res.send({
        status: 0,
        type: "ERROR_PARAMS",
        message: err.message,
      });
      return;
    }

    try {
      const restaurants = await ShopModel.find({ name: `/${keyword}/gi` }, "-_id").limit(50);

      if (restaurants.length) {
        const [latitude, longitude] = geohash.split(",");
        const from = latitude + "," + longitude;
        let to = "";
        //获取百度地图测局所需经度纬度
        restaurants.forEach((item, index) => {
          const slpitStr = index == restaurants.length - 1 ? "" : "|";
          to += item.latitude + "," + item.longitude + slpitStr;
        });
        //获取距离信息，并合并到数据中
        const distance_duration = await this.getDistance(from, to);
        restaurants.map((item, index) => {
          return Object.assign(item, distance_duration[index]);
        });
        res.send(restaurants);
      }
    } catch (err) {
      console.log("搜索餐馆数据失败");
      res.send({
        status: 0,
        type: "ERROR_DATA",
        message: "搜索餐馆数据失败",
      });
    }
  }
}
export default new Shop();
