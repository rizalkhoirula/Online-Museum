const mongoose = require("mongoose");

const BarangSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "username harus diisi"],
    },
    image: {
      type: String,
      required: [true, "image harus diisi"],
    },
    description: {
      type: String,
      required: [true, "image harus diisi"],
    },
  },
  {
    timestamps: true,
  }
);


const barang = mongoose.model("barang", BarangSchema);

module.exports = barang;
