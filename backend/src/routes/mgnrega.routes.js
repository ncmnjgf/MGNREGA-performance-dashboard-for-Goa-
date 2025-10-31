import express from "express";
import {
  getAllData,
  getDistricts,
  getDistrictData,
  clearCache,
} from "../controllers/mgnrega.controller.js";
const router = express.Router();

router.get("/api", getAllData); // all districts & all months
router.get("/api/districts", getDistricts); // list of districts
router.get("/api/data/:district", getDistrictData); // data for one district
router.post("/api/cache/clear", clearCache); // clear cache

export default router;
