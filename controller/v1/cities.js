"use strict";
import Cities from "@models/v1/cities";
import { getIpLocation } from "@api/common";
import pinyin from "pinyin";
import AddressComponent from "@prototype/addressComponent";
// 为什么控制器是controller
class CityHandle extends AddressComponent {
  constructor() {
    super();
    this.getCity = this.getCity.bind(this);
    this.getCityById = this.getCityById.bind(this);
    this.getCityName = this.getCityName.bind(this);
    this.pois = this.pois.bind(this);
  }

  // 获取热门城市/全部城市/定位城市
  async getCity(req, res, next) {
    const type = req.query.type;
    if (!type) {
      res.json({
        name: "ERROR_QUERY_TYPE",
        message: "参数错误",
      });
      return;
    }
    let cityInfo;
    switch (type) {
      case "guess":
        const city = await this.getCityName(req);
        cityInfo = await Cities.cityGuess(city);
        break;
      case "hot":
        cityInfo = await Cities.cityHot();
        break;
      case "group":
        cityInfo = await Cities.cityGroup();
        break;
      default:
        res.json({
          name: "ERROR_QUERY_TYPE",
          message: "参数错误",
        });
        return;
    }

    res.send(cityInfo);
  }

  // 根据id获取城市信息
  async getCityById(req, res, next) {
    const cityid = req.params.id;
    if (isNaN(cityid)) {
      res.json({
        name: "ERROR_PARAM_TYPE",
        message: "参数错误",
      });
      return;
    }
    // 业务逻辑 并控制数据模型
    const cityInfo = await Cities.getCityById(cityid);
    res.send(cityInfo);
  }

  // 根据ip获取所在城市
  async getCityName(req) {
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    console.log("ippp", ip);
    if (process.env.NODE_ENV == "development") {
      ip = "::ffff:36.111.36.146";
    }
    ip = ip.split(":")[3];

    //调用阿里云接口
    const res = await getIpLocation({ ip });
    let { city } = res?.data?.result?.ad_info;
    return pinyin(city, {
      style: pinyin.STYLE_NORMAL,
    })
      .slice(0, -1)
      .join("");
  }

  // 根据经纬度详细定位
  async pois(req, res, next) {
    const geohash = req.params.geohash;
    try {
      if (geohash.indexOf(",") == -1) {
        throw new Error("参数错误");
      }
    } catch (err) {
      console.log("参数错误");
      res.send({
        status: 0,
        type: "ERROR_PARAMS",
        message: "参数错误",
      });
      return;
    }

    const poisArr = geohash.split(",");

    try {
      const { data } = await this.getpois(poisArr[0], poisArr[1]);
      const address = {
        address: data.result.address,
        city: data.result.address_component.province,
        geohash,
        latitude: poisArr[0],
        longitude: poisArr[1],
        name: data.result.formatted_addresses.recommend,
      };
      res.send(address);
    } catch (err) {
      console.log("err", err);

      console.log("getpois返回信息失败");
      res.send({
        status: 0,
        type: "ERROR_DATA",
        message: "获取数据失败",
      });
    }
  }
}

export default new CityHandle();
