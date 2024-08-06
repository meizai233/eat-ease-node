import express from "express";
import CityHandle from "@controller/v1/cities";
import Entry from "@controller/v2/entry";
const router = express.Router();

// 根据经纬度测量位置
router.get("/pois/:geohash", CityHandle.pois);
// 获取食品分类
router.get("/index_entry", Entry.getEntry);

export default router;
