// import fetch from "node-fetch";
import Ids from "../models/ids";
import formidable from "formidable";
import path from "path";
import fs from "fs";

import gm from "gm";

export default class BaseComponent {
  constructor() {
    this.idList = ["restaurant_id", "food_id", "orderId", "user_id", "address_id", "cart_id", "img_id", "category_id", "item_id", "sku_id"];
    this.imgTypeList = ["shop", "food", "avatar", "default"];
    this.uploadImg = this.uploadImg.bind(this);
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
      debugger;
      idData[type]++;
      await idData.save();
      return idData[type];
    } catch (err) {
      console.log("获取ID数据失败");
      throw new Error(err);
    }
  }

  // 上传图片
  async uploadImg(req, res, next) {
    const type = req.params.type;
    if (!this.imgTypeList.includes(type)) {
      console.log("前台传入参数错误");
      res.send({
        status: 0,
        type: "ERROR_PARAMS",
        message: "参数错误",
      });
      return;
    }
    const form = formidable.IncomingForm();
    form.uploadDir = "./public/img/" + type;

    // 解析文件并将它放到repath中 返回相对路径
    form.parse(req, async (err, fields, files) => {
      let img_id;
      try {
        img_id = await this.getId("img_id");
      } catch (err) {
        console.log("获取图片id失败");
        fs.unlink(files.file.path);
        reject(err);
      }
      const imgUrl = (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(16) + img_id;
      const extname = path.extname(files.file.name);
      const repath = "./public/img/" + type + "/" + imgUrl + extname;
      try {
        await fs.rename(files.file.path, repath);
        gm(repath)
          .resize(400, 400, "!")
          .write(repath, async (err) => {
            if (err) {
              console.log("改写图片尺寸失败");
              fs.unlink(repath);
              reject(err);
            } else {
              const path = repath.replace(/^\.\/public/, "");
              res.send({
                status: 1,
                image_path: path,
              });
            }
          });
      } catch (err) {
        console.log("改写图片路径失败");
        fs.unlink(files.file.path);
        reject(err);
      }
    });
  }
}
