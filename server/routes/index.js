const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifToken = require("../middleware/jwt");
const Crypto = require("crypto");
const moment = require("moment");
const path = require("path");

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
  const { Op, json } = require("sequelize");
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
  const { integrasi } = req.query;
  const { tahanan } = require("../models");

  const Tahanan = await tahanan.findAll({
    order: [["nama", "ASC"]],
  });

  if (integrasi) {
    const data = [];

    Tahanan.map((val) => {
      val.statusTahanan !== "Tahanan"
        ? Math.round(
            moment(val.tanggalKeluar).diff(
              moment(val.tanggalMasuk),
              "months",
              true
            )
          ) *
            (2 / 3) >
          Math.round(moment(val.tanggalKeluar).diff(moment(), "months", true))
          ? val.integrasi
            ? data.push(val)
            : null
          : null
        : null;
    });

    return res.json({
      status: 200,
      massage: "Get data successful",
      data: data,
    });
  }

  return res.json({
    status: 200,
    massage: "Get data successful",
    data: Tahanan,
  });
});

router.post("/kunjunganUsers", async (req, res) => {
  const {
    nama,
    NIK,
    alamat,
    jenisKelamin,
    pengikutAnak,
    pengikutDewasa,
    tahanan,
    noHp,
    hubungan,
  } = req.body;
  const { ktp, suratIzin, selfi } = req.files;

  const uuid = Crypto.randomUUID();

  const { kunjungan } = require("../models");
  // let type = null;
  // if (ktpData) {
  //   type = ktpData.split(";")[0].split("/")[1];
  //   require("fs").writeFile(
  //     __dirname +
  //       `/../../public/upload/kunjungan/${moment().format(
  //         "YYYY-MM-DD"
  //       )}_${uuid}.${type}`,
  //     new Buffer.from(
  //       ktpData.replace(/^data:image\/\w+;base64,/, ""),
  //       "base64"
  //     ),
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

  // let type2 = null;
  // if (suratIzinData && status == "Titipan") {
  //   type2 = suratIzinData.split(";")[0].split("/")[1];
  //   require("fs").writeFile(
  //     __dirname +
  //       `/../../public/upload/kunjungan/${moment().format(
  //         "YYYY-MM-DD"
  //       )}_${uuid}_suratIzin.${type2}`,
  //     new Buffer.from(
  //       suratIzinData.replace(/^data:image\/\w+;base64,/, ""),
  //       "base64"
  //     ),
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

  // let type = null;
  // let urlSelfi = null;
  // if (selfi) {
  //   type = selfi.split(";")[0].split("/")[1];
  //   require("fs").writeFile(
  //     __dirname +
  //       `/../../public/upload/kunjungan/${moment().format(
  //         "YYYY-MM-DD"
  //       )}_${uuid}_selfi.${type}`,
  //     new Buffer.from(
  //       ktpData.replace(/^data:image\/\w+;base64,/, ""),
  //       "base64"
  //     ),
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  //   urlSelfi = `/upload/kunjungan/${moment().format(
  //     "YYYY-MM-DD"
  //   )}_${uuid}_selfi.${type}`;
  // }

  const totalWaktuKunj = await kunjungan.findAll({
    where: {
      waktuKunjungan: moment().format("YYYY-MM-DD"),
    },
  });

  const orangKunjungan = await kunjungan.findAll({
    where: {
      tahanan_id: tahanan,
      waktuKunjungan: moment().format("YYYY-MM-DD"),
    },
  });

  if (orangKunjungan.length) {
    return res.json({
      status: 400,
      massage:
        "Maaf, Warga Binaan ini telah di kunjungi hari ini,\nKembali lagi besok",
    });
  }

  if (totalWaktuKunj.length > 200) {
    return res.json({
      status: 400,
      massage: "Maaf, Waktu Kunjungan Melebihi Batas",
    });
  }

  const fileUpload = (files, type, dirname) => {
    if (files) {
      let nameFile = "/upload" + dirname + files.name;
      files.mv(require("path").join(__dirname, "../../public" + nameFile));
      return nameFile;
    } else {
      return null;
    }
  };

  const data = {
    uuid: uuid,
    waktuKunjungan: moment().format("YYYY-MM-DD"),
    user_id: 0,
    nama: nama,
    NIK: NIK,
    alamat: alamat,
    jenisKelamin: jenisKelamin,
    pengikutDewasa: pengikutDewasa,
    pengikutAnak: pengikutAnak,
    tahanan_id: tahanan,
    hubungan: hubungan,
    noHp: noHp,
    img: fileUpload(
      ktp,
      "image",
      `/kunjungan/${moment().format("YYYY-MM-DD")}_${uuid}_ktp`
    ),
    selfi: fileUpload(
      selfi,
      "image",
      `/kunjungan/${moment().format("YYYY-MM-DD")}_${uuid}_selfi`
    ),
    suratIzin: fileUpload(
      suratIzin,
      "image",
      `/kunjungan/${moment().format("YYYY-MM-DD")}_${uuid}_suratIzin`
    ),
    // img: ktpData
    //   ? "/upload/kunjungan/" +
    //     moment().format("YYYY-MM-DD") +
    //     "_" +
    //     uuid +
    //     "." +
    //     type
    //   : null,
    // suratIzin:
    //   suratIzinData && status == "Titipan"
    //     ? "/upload/kunjungan/" +
    //       moment().format("YYYY-MM-DD") +
    //       "_" +
    //       uuid +
    //       "_suratIzin." +
    //       type2
    //     : null,
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
    tahanan_id,
    hubungan,
    noHp,
    email,
  } = req.body;
  const { ktp, files1, files2, files3, files4, files5, files6, files7 } =
    req.files;

  const uuid = Crypto.randomUUID();

  const { pengajuan } = require("../models");

  // const fileUpload = (files, type, dirname) => {
  //   if (files) {
  //     let nameFile =
  //       "/upload/" + dirname + "." + files.split(";")[0].split("/")[1];

  //     if (type == "image") {
  //       require("fs").writeFile(
  //         __dirname + `/../../public${nameFile}`,
  //         new Buffer.from(
  //           files.replace(/^data:image\/\w+;base64,/, ""),
  //           "base64"
  //         ),
  //         (err) => {
  //           console.log(err);
  //         }
  //       );
  //     } else if (type == "application") {
  //       require("fs").writeFile(
  //         __dirname + `/../../public${nameFile}`,
  //         new Buffer.from(
  //           files.replace(/^data:application\/\w+;base64,/, ""),
  //           "base64"
  //         ),
  //         (err) => {
  //           console.log(err);
  //         }
  //       );
  //     }

  //     return nameFile;
  //   } else {
  //     return null;
  //   }
  // };

  const fileUpload = (files, type, dirname) => {
    if (files) {
      let nameFile = "/upload" + dirname + files.name;
      files.mv(path.join(__dirname, "../../public" + nameFile));
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
    tahanan_id: tahanan_id,
    ktp: fileUpload(
      ktp,
      "image",
      `/pengajuan/${moment().format("YYYY-MM-DD")}_${uuid}_ktp`
    ),
    files1: fileUpload(
      files1,
      "application",
      `/pengajuan/${moment().format("YYYY-MM-DD")}_${uuid}_files1`
    ),
    files2: fileUpload(
      files2,
      "application",
      `/pengajuan/${moment().format("YYYY-MM-DD")}_${uuid}_files2`
    ),
    files3: fileUpload(
      files3,
      "application",
      `/pengajuan/${moment().format("YYYY-MM-DD")}_${uuid}_files3`
    ),
    files4: fileUpload(
      files4,
      "application",
      `/pengajuan/${moment().format("YYYY-MM-DD")}_${uuid}_files4`
    ),
    files5: fileUpload(
      files5,
      "application",
      `/pengajuan/${moment().format("YYYY-MM-DD")}_${uuid}_files5`
    ),
    files6: fileUpload(
      files6,
      "application",
      `/pengajuan/${moment().format("YYYY-MM-DD")}_${uuid}_files6`
    ),
    files7: fileUpload(
      files7,
      "application",
      `/pengajuan/${moment().format("YYYY-MM-DD")}_${uuid}_files7`
    ),
  };

  // const nodemailer = require("nodemailer");
  // const dotenv = require("dotenv").config();

  // var transporter = nodemailer.createTransport({
  //   host: dotenv.parsed.MAIL_HOST,
  //   port: dotenv.parsed.MAIL_PORT,
  //   auth: {
  //     user: dotenv.parsed.MAIL_USERNAME,
  //     pass: dotenv.parsed.MAIL_PASSWORD,
  //   },
  //   tls: {
  //     rejectUnauthorized: true,
  //   },
  // });

  // var mailOptionsAdmin = {
  //   from: "admin@easyrubero.com",
  //   to: "humasrutanbkl@gmail.com",
  //   subject: "SYSTEM INTEGRASI -easyrubero.com",
  //   text: `
  //   Data Users Yang Membuat Integrasi
  //   nama: ${nama},
  //   NIK: ${nik},
  //   alamat: ${alamat},
  //   jenisKelamin: ${jenisKelamin},
  //   noHp: ${noHp},
  //   hubungan: ${hubungan},
  //   email: ${email}`,
  // };

  // var mailOptionsUser = {
  //   from: "admin@easyrubero.com",
  //   to: email,
  //   subject: "SYSTEM INTEGRASI -easyrubero.com",
  //   text: `Selamat anda berhasil daftar integrasi, Silahkan Tunggu informasi selanjutnya melalui WA/Email ini`,
  // };

  // transporter.sendMail(mailOptionsAdmin, function (error, info) {
  //   console.log(info);
  //   console.log(error);
  // });
  // transporter.sendMail(mailOptionsUser, function (error, info) {
  //   console.log(info);
  //   console.log(error);
  // });

  if (
    !data.ktp &&
    !data.files1 &&
    !data.files2 &&
    !data.files3 &&
    !data.files4
  ) {
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
  const { nama, NIK, alamat, jenisKelamin, hubungan, ket, tahanan, noHp } =
    req.body;
  const { ktp } = req.files;

  const uuid = Crypto.randomUUID();

  const { titipan } = require("../models");
  // let type = null;
  // if (ktpData) {
  //   type = ktpData.split(";")[0].split("/")[1];
  //   require("fs").writeFile(
  //     __dirname +
  //       `/../../public/upload/titipan/${moment().format(
  //         "YYYY-MM-DD"
  //       )}_${uuid}.${type}`,
  //     new Buffer.from(
  //       ktpData.replace(/^data:image\/\w+;base64,/, ""),
  //       "base64"
  //     ),
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

  const totalTitipan = await titipan.findAll({
    where: {
      tanggal: moment().format("YYYY-MM-DD"),
    },
  });

  if (totalTitipan.length > 200) {
    return res.json({
      status: 400,
      massage: "Maaf, Penitipan Melebihi Batas",
      data: data,
    });
  }

  const fileUpload = (files, type, dirname) => {
    if (files) {
      let nameFile = "/upload" + dirname + files.name;
      files.mv(path.join(__dirname, "../../public" + nameFile));
      return nameFile;
    } else {
      return null;
    }
  };

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
    tanggal: moment().format("YYYY-MM-DD"),
    img: fileUpload(
      ktp,
      "image",
      `/titipan/${moment().format("YYYY-MM-DD")}_${uuid}_ktp`
    ),
    // img: ktp
    //   ? "/upload/titipan/" +
    //     moment().format("YYYY-MM-DD") +
    //     "_" +
    //     uuid +
    //     "." +
    //     type
    //   : null,
  };

  await titipan.create(data);

  res.json({
    status: 200,
    massage: "Berhasil dibuat",
    data: data,
  });
});

router.post("/slider", async (req, res) => {
  const { del, get } = req.body;
  const fs = require("fs");
  // Define the upload directory inside the public folder
  const uploadDir = path.join(process.cwd(), "public", "upload/slider");

  if (get) {
    try {
      // Check if the directory exists
      if (!fs.existsSync(uploadDir)) {
        return res.status(200).json({ error: "Directory not found" });
      }

      // Read the files in the directory
      const files = fs.readdirSync(uploadDir); // returns an array of filenames

      // If you want the full path of each file, you can map over the filenames
      const filePaths = files.map((file) => `/upload/slider/${file}`);

      // Return the list of file paths
      return res.status(200).json(filePaths);
    } catch (error) {
      console.error("Error reading files:", error);
      return res.status(200).json({ error: "Failed to get files" });
    }
  } else if (del) {
    const filename = del;

    if (!filename || typeof filename !== "string") {
      return res.status(200).json({ error: "Filename is required" });
    }

    // Ensure the file exists before attempting to delete it
    const filePath = path.join(process.cwd(), "public", filename);
    if (!fs.existsSync(filePath)) {
      return res.status(200).json({ error: "File not found" });
    }

    try {
      // Delete the file
      fs.unlinkSync(filePath); // Synchronously deletes the file

      // Return a success message
      return res
        .status(200)
        .json({ message: `File ${filename} deleted successfully` });
    } catch (error) {
      console.error("Error deleting file:", error);
      return res.status(200).json({ error: "Failed to delete the file" });
    }
  }

  // Check if files are present in the request
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(200).json({ error: "No files were uploaded." });
  }

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Process each file (handling multiple files, if present)
  const uploadedFiles = req.files;

  const filePaths = [];

  // If multiple files are uploaded, iterate through them
  for (const [key, file] of Object.entries(uploadedFiles)) {
    if (Array.isArray(file)) {
      for (const singleFile of file) {
        // Rename the file with the current date and time
        const timestamp = new Date().toISOString().replace(/[:.-]/g, ""); // Create a timestamp string (remove colons, dots, etc.)
        const newFileName = `${timestamp}-${singleFile.name}`;
        const filePath = path.join(uploadDir, newFileName);

        // Move the file to the upload directory with the new name
        await singleFile.mv(filePath);
        filePaths.push(`/upload/${newFileName}`);
      }
    } else {
      // Rename the file with the current date and time
      const timestamp = new Date().toISOString().replace(/[:.-]/g, ""); // Create a timestamp string (remove colons, dots, etc.)
      const newFileName = `${timestamp}-${file.name}`;
      const filePath = path.join(uploadDir, newFileName);

      // Move the file to the upload directory with the new name
      await file.mv(filePath);
      filePaths.push(`/upload/${newFileName}`);
    }
  }

  // Return the paths of the uploaded files
  res.status(200).json({
    message: "Files uploaded successfully.",
    filePaths,
  });
});

module.exports = router;
