import BaseComponent from "./baseComponent";
import axios from "axios";

/*
腾讯地图和百度地图API统一调配组件
 */

class AddressComponent extends BaseComponent {
  constructor() {
    super();
    // 待办 迁移腾讯地图到这里
    this.tencentkey = "YGHBZ-TXOE4-U7FUP-FIZ7G-P62O5-XXBLW";
    this.baidukey = "Ckp8LbmZnK2F0D7j9oo3v5raSqGNcjJY";
  }

  //获取定位地址
  async guessPosition(req) {}

  //通过geohash获取精确位置
  async getpois(lat, lng) {
    try {
      const res = await axios.get("https://apis.map.qq.com/ws/geocoder/v1", {
        params: {
          key: this.tencentkey,
          location: lat + "," + lng,
        },
      });
      if (res.status == 200) {
        return res;
      } else {
        console.log("通过获geohash取具体位置失败");
        throw new Error("通过geohash获取具体位置失败");
      }
    } catch (error) {
      console.log(error);
      throw new Error("getpois获取定位失败");
    }
  }
  //搜索地址
  async getSpecificLocation(params) {
    return await axios.get("https://apis.map.qq.com/ws/place/v1/suggestion", {
      params: {
        key: this.tencentkey,
        ...params,
        page_size: 10,
      },
    });
  }

  //骑行路线规划
  async getDistance(from, to) {
    try {
      const res = await axios.get("https://api.map.baidu.com/routematrix/v2/driving", {
        params: {
          ak: this.baidukey,
          output: "json",
          origins: from,
          destinations: to,
        },
      });

      if (res.status == 200) {
        const positionArr = [];
        res.data.result.forEach((item) => {
          positionArr.push({
            distance: item.distance.text,
            order_lead_time: item.duration.text,
          });
        });
        return positionArr;
      } else {
        console.log("调用百度地图测距失败");
        throw new Error("调用百度地图测距失败");
      }
    } catch (err) {
      console.log("err", err);

      console.log("获取位置距离失败");
      throw new Error("获取位置距离失败");
    }
  }
  //通过ip地址获取精确位置
  //通过geohash获取精确位置
}

export default AddressComponent;
