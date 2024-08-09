import express from "express";
import Shop from "@controller/shopping/shop";
import Category from "@controller/shopping/category";
import Food from "../controller/shopping/food";
import BaseComponent from "../prototype/baseComponent";
const baseHandle = new BaseComponent();

const router = express.Router();

// 添加餐馆
router.post("/addshop", Shop.addShop);
// 查询餐馆
router.get("/restaurants", Shop.getRestaurants);
// 上传图片
router.post("/addimg/:type", baseHandle.uploadImg);
// 添加食物
router.post("/addfood", Food.addFood);
// 获取店铺食品种类
router.get("/getcategory/:restaurant_id", Food.getCategory);
// 添加食品种类
router.post("/addcategory", Food.addCategory);
// 获取所有商品分类
router.get("/v2/restaurant/category", Category.getCategories);

export default router;
