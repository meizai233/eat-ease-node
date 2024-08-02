import { getSpecificLocation } from "@api/common.js";
import Cities from "@models/v1/cities";

class SearchPlace {
  constructor() {}

  async search(req, res, next) {
    const { city_id, keyword } = req.query;

    try {
      const cityInfo = await Cities.getCityById(city_id);
      const params = {
        keyword: keyword,
        region: cityInfo.name,
      };
      const resObj = await getSpecificLocation(params);
      const resArr = [];
      if (resObj.data.data) {
        resObj.data.data.forEach((item, index) => {
          resArr.push({
            name: item.title,
            address: item.address,
            latitude: item.location.lat,
            longitude: item.location.lng,
            geohash: item.location.lat + "," + item.location.lng,
          });
        });
      } else {
        throw new Error(res.data.message);
      }

      res.send(resArr);
    } catch (error) {
      console.log("er", error);

      res.send({
        name: "GET_ADDRESS_ERROR",
        message: "获取地址信息失败",
      });
    }
  }
}

export default new SearchPlace();
