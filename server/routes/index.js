const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifToken = require("../middleware/jwt");
const Crypto = require("crypto");

const user = require("./user");
const kunjungan = require("./kunjungan");
const pengajuan = require("./pengajuan");
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
router.use("/pengajuan", verifToken, pengajuan);
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
    pengikutAnak,
    pengikutDewasa,
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

  const orangKunjungan = kunjungan.findAll({
    where: {
      tahanan_id: tahanan,
      waktuKunjungan: waktuKunjungan,
    },
  });

  if (orangKunjungan) {
    return res.json({
      status: 400,
      massage:
        "Maaf, Warga Binaan ini telah di kunjungi hari ini,\nKembali lagi besok",
      data: data,
    });
  }

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
    pengikutDewasa: pengikutDewasa,
    pengikutAnak: pengikutAnak,
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

router.post("/pengajuanUsers", async (req, res) => {
  const {
    pilihan,
    nama,
    nik,
    jenisKelamin,
    alamat,
    ktp,
    hubungan,
    noHp,
    email,
    files1,
    files2,
    files3,
    files4,
    files5,
    files6,
    files7,
  } = req.body;

  const uuid = Crypto.randomUUID();

  const { pengajuan } = require("../models");

  const fileUpload = (files, type, dirname) => {
    if (files) {
      let nameFile =
        "/upload/" + dirname + "." + files.split(";")[0].split("/")[1];

      if (type == "image") {
        require("fs").writeFile(
          __dirname + `/../../public${nameFile}`,
          new Buffer.from(
            files.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          ),
          (err) => {
            console.log(err);
          }
        );
      } else if (type == "application") {
        require("fs").writeFile(
          __dirname + `/../../public${nameFile}`,
          new Buffer.from(
            files.replace(/^data:application\/\w+;base64,/, ""),
            "base64"
          ),
          (err) => {
            console.log(err);
          }
        );
      }

      return nameFile;
    } else {
      return null;
    }
  };

  const data = {
    uuid: uuid,
    pilihan: pilihan,
    user_id: 0,
    nama: nama,
    NIK: nik,
    alamat: alamat,
    jenisKelamin: jenisKelamin,
    noHp: noHp,
    hubungan: hubungan,
    email: email,
    ktp: fileUpload(ktp, "image", `pengajuan/${uuid}_ktp`),
    files1: fileUpload(files1, "application", `pengajuan/${uuid}_files1`),
    files2: fileUpload(files2, "application", `pengajuan/${uuid}_files2`),
    files3: fileUpload(files3, "application", `pengajuan/${uuid}_files3`),
    files4: fileUpload(files4, "application", `pengajuan/${uuid}_files4`),
    files5: fileUpload(files5, "application", `pengajuan/${uuid}_files5`),
    files6: fileUpload(files6, "application", `pengajuan/${uuid}_files6`),
    files7: fileUpload(files7, "application", `pengajuan/${uuid}_files7`),
  };

  const nodemailer = require("nodemailer");
  const dotenv = require("dotenv").config();

  var transporter = nodemailer.createTransport({
    host: dotenv.parsed.MAIL_HOST,
    port: dotenv.parsed.MAIL_PORT,
    auth: {
      user: dotenv.parsed.MAIL_USERNAME,
      pass: dotenv.parsed.MAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  var mailOptionsAdmin = {
    from: "admin@easyrubero.com",
    to: "humasrutanbkl@gmail.com",
    subject: "SYSTEM PENGAJUAN -easyrubero.com",
    text: `
    Data Users Yang Membuat Pengajuan
    nama: ${nama},
    NIK: ${nik},
    alamat: ${alamat},
    jenisKelamin: ${jenisKelamin},
    noHp: ${noHp},
    hubungan: ${hubungan},
    email: ${email}`,
  };

  var mailOptionsUser = {
    from: "admin@easyrubero.com",
    to: email,
    subject: "SYSTEM PENGAJUAN -easyrubero.com",
    text: `Selamat anda berhasil daftar pengajuan, Silahkan Tunggu informasi selanjutnya melalui WA/Email ini`,
  };

  transporter.sendMail(mailOptionsAdmin, function (error, info) {});
  transporter.sendMail(mailOptionsUser, function (error, info) {});

  if (!ktp && !files1) {
    res.json({
      status: 400,
      massage: "KTP & File harus terisi",
    });
  } else {
    await pengajuan.create(data);
    res.json({
      status: 200,
      massage: "Berhasil dibuat",
      data: data,
    });
  }
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

  const totalTitipan = titipan.findAll({
    where: {
      tanggal: tanggal,
    },
  });

  if (totalTitipan.length > 150) {
    return res.json({
      status: 400,
      massage: "Maaf, Pentipan Melebihi Batas",
      data: data,
    });
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
