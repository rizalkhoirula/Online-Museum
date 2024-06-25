const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  AddBarang,
  Editbarang,
  Hapusbarang,
  Getbarangbyid,
  Getallbarang,
  Getimagebyid,
  Countbarang,
} = require("../services/barangService");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/assets/image");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// post /api/v1/../
router.post("/add", upload.single("image"), AddBarang);
router.put("/:id", upload.single("image"), Editbarang);
router.delete("/:id", Hapusbarang);
router.get("/getbyid/:id", Getbarangbyid);
router.get("/getall", Getallbarang);
router.get("/getimage/:barang_id", Getimagebyid);
router.get("/count", Countbarang);

module.exports = router;
