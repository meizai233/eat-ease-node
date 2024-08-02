import express from "express";
import CityHandle from "@controller/v1/cities";
import SearchPlace from "@controller/v1/place";

const router = express.Router();

router.get("/cities", CityHandle.getCity);
router.get("/cities/:id", CityHandle.getCityById);
router.get("/pois", SearchPlace.search);

export default router;
