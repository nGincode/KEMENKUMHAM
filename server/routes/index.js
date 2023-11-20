const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifToken = require("../middleware/jwt");
const Crypto = require("crypto");

const user = require("./user");
const kunjungan = require("./kunjungan");
const titipan = require("./titipan");
const tahanan = require("./tahanan");
const auth = require("./auth");
const permission = require("./permission");

router.get("/", async (req, res) => {
  // res.send("API Starting!");
  const { user } = require("../models");
  const User = await user.findAll({});
  res.send(User ? "API Starting!" : "Database not Connect");
});

router.get("/token", (req, res) => {
  const data = { id: 1 };
  res.send(jwt.sign({ data }, "fembinurilham"));
});

router.use("/user", verifToken, user);
router.use("/permission", verifToken, permission);
router.use("/tahanan", verifToken, tahanan);
router.use("/kunjungan", verifToken, kunjungan);
router.use("/titipan", verifToken, titipan);
router.use("/", auth);

router.post("/suratKunjungan", async (req, res) => {
  const { uuid, barcode } = req.body;
  const { tahanan, kunjungan } = require("../models");
  const { Op } = require("sequelize");
  const moment = require("moment");
  let Kunjungan = await kunjungan.findOne({
    where: {
      uuid: uuid,
    },
    order: [["id", "DESC"]],
    include: [
      {
        model: tahanan,
        as: "tahanan",
        attributes: {
          exclude: ["uuid", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  if (!Kunjungan.antrian && !barcode) {
    const antrian = await kunjungan.findAll({
      where: {
        waktuKunjungan: Kunjungan.waktuKunjungan,
        antrian: {
          [Op.not]: null,
        },
      },
    });

    await Kunjungan.update({ antrian: antrian ? antrian.length + 1 : 1 });
    Kunjungan.antrian = antrian ? antrian.length + 1 : 1;
  }

  return res.json({
    status: 200,
    massage: "Get data successful",
    data: Kunjungan,
  });
});

router.post("/suratTitipan", async (req, res) => {
  const { uuid } = req.body;
  const { tahanan, titipan } = require("../models");
  let Titipan = await titipan.findOne({
    where: {
      uuid: uuid,
    },
    order: [["id", "DESC"]],
    include: [
      {
        model: tahanan,
        as: "tahanan",
        attributes: {
          exclude: ["uuid", "createdAt", "updatedAt"],
        },
      },
    ],
  });

  return res.json({
    status: 200,
    massage: "Get data successful",
    data: Titipan,
  });
});

router.get("/narapidana", async (req, res) => {
  const { uuid } = req.body;
  const { tahanan } = require("../models");
  const Tahanan = await tahanan.findAll({
    order: [["nama", "ASC"]],
  });
  return res.json({
    status: 200,
    massage: "Get data successful",
    data: Tahanan,
  });
});

router.post("/kunjunganUsers", async (req, res) => {
  const {
    nama,
    waktuKunjungan,
    NIK,
    alamat,
    jenisKelamin,
    pengikutWanita,
    pengikutPria,
    tahanan,
    ktpData,
    noHp,
    suratIzinData,
    status,
  } = req.body;

  const uuid = Crypto.randomUUID();

  const { kunjungan } = require("../models");
  let type = null;
  if (ktpData) {
    type = ktpData.split(";")[0].split("/")[1];
    require("fs").writeFile(
      __dirname + `/../../public/upload/kunjungan/${uuid}.${type}`,
      new Buffer.from(
        ktpData.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
      (err) => {
        console.log(err);
      }
    );
  }

  let type2 = null;
  if (suratIzinData && status == "Titipan") {
    type2 = suratIzinData.split(";")[0].split("/")[1];
    require("fs").writeFile(
      __dirname + `/../../public/upload/kunjungan/${uuid}_suratIzin.${type2}`,
      new Buffer.from(
        suratIzinData.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
      (err) => {
        console.log(err);
      }
    );
  }

  const totalWaktuKunj = kunjungan.findAll({
    where: {
      waktuKunjungan: waktuKunjungan,
    },
  });

  if (totalWaktuKunj.length > 100) {
    return res.json({
      status: 400,
      massage: "Maaf, Waktu Kunjungan Melebihi Batas",
      data: data,
    });
  }

  const data = {
    uuid: uuid,
    waktuKunjungan: waktuKunjungan,
    user_id: 0,
    nama: nama,
    NIK: NIK,
    alamat: alamat,
    jenisKelamin: jenisKelamin,
    pengikutPria: pengikutPria,
    pengikutWanita: pengikutWanita,
    tahanan_id: tahanan,
    noHp: noHp,
    img: ktpData ? "/upload/kunjungan/" + uuid + "." + type : null,
    suratIzin:
      suratIzinData && status == "Titipan"
        ? "/upload/kunjungan/" + uuid + "_suratIzin." + type2
        : null,
  };

  await kunjungan.create(data);

  res.json({
    status: 200,
    massage: "Berhasil dibuat",
    data: data,
  });
});

router.post("/titipanUsers", async (req, res) => {
  const {
    tanggal,
    nama,
    NIK,
    alamat,
    jenisKelamin,
    hubungan,
    ket,
    tahanan,
    ktpData,
    noHp,
  } = req.body;

  const uuid = Crypto.randomUUID();

  const { titipan } = require("../models");
  let type = null;
  if (ktpData) {
    type = ktpData.split(";")[0].split("/")[1];
    require("fs").writeFile(
      __dirname + `/../../public/upload/titipan/${uuid}.${type}`,
      new Buffer.from(
        ktpData.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
      (err) => {
        console.log(err);
      }
    );
  }

  const data = {
    uuid: uuid,
    user_id: 0,
    nama: nama,
    NIK: NIK,
    alamat: alamat,
    jenisKelamin: jenisKelamin,
    hubungan: hubungan,
    keterangan: ket,
    tahanan_id: tahanan,
    noHp: noHp,
    tanggal: tanggal,
    img: ktpData ? "/upload/titipan/" + uuid + "." + type : null,
  };

  await titipan.create(data);

  res.json({
    status: 200,
    massage: "Berhasil dibuat",
    data: data,
  });
});

module.exports = router;
