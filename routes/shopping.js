import express from "express";
import Shop from "@controller/shopping/shop";

const router = express.Router();

// 添加餐馆
router.post("/addshop", Shop.addShop);
// 查询餐馆
router.get("/restaurants", Shop.getRestaurants);

export default router;
