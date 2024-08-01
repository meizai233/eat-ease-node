"use strict";
import Cities from "@models/v1/cities";
import { getIpLocation } from "@api/common";
import pinyin from "pinyin";
// 为什么控制器是controller
class CityHandle {
  constructor() {
    this.cityGuess = this.cityGuess.bind(this);
  }

  async cityGuess(req, res, next) {
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
    }

    res.send(cityInfo);
  }

  async getCityName(req) {
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    const ipArr = ip.split(":")[2];
    ip = ipArr[ipArr.length - 1];
    console.log("ippp", ip);

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
