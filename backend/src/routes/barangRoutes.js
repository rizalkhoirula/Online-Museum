const express = require("express");
const router = express.Router();
const {
  Addbarang,
  Editbarang,
  Hapusbarang,
  Getbarangbyid,
  Getallbarang,
} = require("../services/barangService");

// post /api/v1/../
router.post("/", Addbarang);
router.put("/", Editbarang);
router.delete("/", Hapusbarang);
router.get("/", Getbarangbyid);
router.get("/", Getallbarang);

