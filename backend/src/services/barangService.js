const barang = require("../models/barangModels");
const path = require("path");
const fs = require("fs/promises");

const AddBarang = async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file;

    if (!name || !image || !description) {
      return res.status(400).send("Semua field harus diisi");
    }

    const newBarang = await barang.create({
      name,
      image: image.filename,
      description,
    });
    await newBarang.save();

    res.status(201).send(newBarang);
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat menambahkan barang");
  }
};

const Editbarang = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const image = req.file;

  try {
    const editBarang = await barang.findById(id);

    if (!editBarang) {
      return res.status(404).send("Barang not found");
    }

    if (image) {
      const imagePath = path.join(
        __dirname,
        "..",
        "assets",
        "image",
        editBarang.image
      );
      await fs.unlink(imagePath);
      editBarang.image = image.filename;
    }

    editBarang.name = name;
    editBarang.description = description;

    await editBarang.save();

    res.status(200).json(editBarang);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while editing barang");
  }
};

const Hapusbarang = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBarang = await barang.findById(id);

    if (!deletedBarang) {
      return res.status(404).json({ error: "Barang not found" });
    }

    const imagePath = path.join(
      __dirname,
      "..",
      "assets",
      "image",
      deletedBarang.image
    );
    await fs.unlink(imagePath);

    await barang.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: `Barang with ID ${id} deleted successfully.` });
  } catch (error) {
    console.error("Error deleting barang:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const Getbarangbyid = async (req, res) => {
  const { id } = req.params;

  try {
    const barangId = await barang.findById(id);

    return res.status(200).json(barangId);
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ error: "Gagal mengambil barang dari database" });
  }
};
const Getallbarang = async (req, res) => {
  try {
    const allBarang = await barang.find();

    res.status(200).json(allBarang);
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat mengambil barang");
  }
};

const Getimagebyid = async (req, res) => {
  try {
    const id = req.params.barang_id;
    const barangData = await barang.findById(id);

    if (!barangData) {
      return res.status(404).send("Data barang tidak ditemukan");
    }

    const imageName = barangData.image;
    const imagePath = path.join(__dirname, "..", "assets", "image", imageName);

    console.log("Requested image path:", imagePath);
    res.sendFile(imagePath);
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat mengambil gambar");
  }
};
const Countbarang = async (req, res) => {
  try {
    const barangCount = await barang.countDocuments();

    res.status(200).json({ count: barangCount });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat menghitung pengguna" });
  }
};

module.exports = {
  AddBarang,
  Editbarang,
  Hapusbarang,
  Getbarangbyid,
  Getallbarang,
  Getimagebyid,
  Countbarang,
};
