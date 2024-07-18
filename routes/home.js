import express from "express";
import Food from "../models/food.js";
const router = express.Router();

//在哪里连接数据库了 为啥就可以findone
router.get("/", async (req, res) => {
  const foods = await Food.findOne();
});

export default router;
