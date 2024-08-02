"use strict";
import Cities from "@models/v1/cities";
import { getIpLocation } from "@api/common";
import pinyin from "pinyin";
// 为什么控制器是controller
class CityHandle {
  constructor() {
    this.getCity = this.getCity.bind(this);
  }

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
}

export default new CityHandle();
