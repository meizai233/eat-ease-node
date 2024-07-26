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
      // 这是在干嘛
      item[1].forEach((cityItem) => {
        if (cityItem.pinyin == name) {
          cityInfo = cityItem;
        }
      });
    }
  });

  return cityInfo;
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
