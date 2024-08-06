import mongoose from "mongoose";

const citySchema = new mongoose.Schema({
  id: Number,
  name: String,
  abbr: String,
  area_code: String,
  sort: Number,
  latitude: Number,
  longitude: Number,
  is_map: Boolean,
  pinyin: String,
});

citySchema.statics.cityGuess = async function (name) {
  const firstWord = name.substr(0, 1).toUpperCase();
  const city = await this.findOne();
  let cityInfo = null;

  Object.entries(city._doc.data).forEach((item) => {
    if (item[0] == firstWord) {
      item[1].forEach((cityItem) => {
        if (cityItem.pinyin == name) {
          cityInfo = cityItem;
        }
      });
    }

    // 待办 对于参数错误 如何统一处理？
    // 待办 对于查找数据失败 如何统一处理？
  });

  return cityInfo;
};

citySchema.statics.getCityById = async function (id) {
  const city = await this.findOne();
  for (const [, data] of Object.entries(city._doc.data)) {
    if (data && Array.isArray(data)) {
      const cityItem = data.find((cityItem) => cityItem.id == id);
      if (cityItem) {
        return cityItem;
      }
    }
  }
  return null; // 如果找不到匹配的城市，可以返回 null 或者适当的默认值
};

citySchema.statics.cityHot = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const city = await this.findOne();
      resolve(city._doc.data.hotCities);
    } catch (err) {
      console.error(err);
    }
  });
};

citySchema.statics.cityGroup = function () {
  return new Promise(async (resolve, reject) => {
    try {
      const city = await this.findOne();
      let cityObj = city._doc.data;
      delete cityObj._id;
      delete cityObj.hotCities;
      resolve(cityObj);
    } catch (err) {
      console.error(err);
    }
  });
};

const Cities = mongoose.model("cities", citySchema);

export default Cities;
