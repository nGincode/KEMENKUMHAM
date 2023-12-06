const jwt = require("jsonwebtoken");
const { hash, verify } = require("node-php-password");
const { User, tahanan, kunjungan, pengajuan } = require("../models");
const { Op } = require("sequelize");
const Crypto = require("crypto");
const numeral = require("numeral");
const moment = require("moment");

const getId = async (req, res) => {
  // const { users_id, users_uuid, email, username } = req.user;
  // const { uuid } = req.params;
  // const Npwp = await stock.findOne({
  //   where: { uuid: uuid },
  //   attributes: ["uuid", "stock", "name", "phone", "address"],
  // });
  // if (!Npwp) {
  //   return res.json({
  //     message: "STOCK not found",
  //   });
  // }
  // res.json({
  //   status: 200,
  //   massage: "Get data successful",
  //   data: Npwp,
  // });
};
const put = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const {
    name,
    phone,
    jalan,
    block,
    no,
    rt,
    rw,
    kec,
    kel,
    prov,
    kabkot,
    kodepos,
    email,
    company_id,
  } = req.body;

  const Npwp = await stock.findOne({
    where: { uuid: uuid },
  });

  const Company = await company.findOne({
    where: {
      uuid: company_id,
    },
  });

  if (!Company) {
    return res.status(400).json({
      massage: "Company not found",
    });
  }

  if (!Npwp) {
    return res.json({
      message: "STOCK not found",
    });
  }

  const data = {
    stock: req.body.stock,
    name: name,
    phone: phone,
    email: email,
    address: {
      jalan: jalan,
      block: block,
      no: no,
      rt: rt,
      rw: rw,
      kec: kec,
      kel: kel,
      prov: prov,
      kabkot: kabkot,
      kodepos: kodepos,
    },
    company_id: Company.id,
  };

  await stock.update(data);

  res.json({
    status: 200,
    massage: "Update data successful",
    data: data,
  });
};

const putId = async (req, res) => {
  const { uuid } = req.params;
  const { users_id, users_uuid } = req.user;
  const {
    nama,
    waktuKunjungan,
    NIK,
    alamat,
    jenisKelamin,
    pengikutPria,
    pengikutWanita,
    tahanan_id,
    noHp,
    hubungan,
    image,
    imgDel,
  } = req.body;

  const Kunjungan = await kunjungan.findOne({
    where: { uuid: uuid },
  });

  if (!Kunjungan) {
    return res.status(400).json({
      massage: "Kunjungan tidak ada",
    });
  }

  let type = null;

  let imgData = null;
  if (!imgDel) {
    if (image) {
      type = image.split(";")[0].split("/")[1];
      require("fs").writeFile(
        __dirname + `/../../public/upload/kunjungan/${uuid}.${type}`,
        new Buffer.from(
          image.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        ),
        (err) => {
          console.log(err);
        }
      );
      imgData = "/upload/kunjungan/" + uuid + "." + type;
    } else {
      imgData = Kunjungan.img;
    }
  }

  const data = {
    waktuKunjungan: waktuKunjungan,
    nama: nama,
    NIK: NIK,
    alamat: alamat,
    jenisKelamin: jenisKelamin,
    pengikutPria: pengikutPria,
    pengikutWanita: pengikutWanita,
    tahanan_id: tahanan_id,
    noHp: noHp,
    hubungan: hubungan,
    img: imgData,
  };

  await Kunjungan.update(data);

  res.json({
    status: 200,
    massage: "Berhasil diubah",
    data: data,
  });
};
const del = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const { uuid } = req.params;

  const Pengajuan = await pengajuan.findOne({
    where: { uuid: uuid },
  });

  if (!Pengajuan) {
    return res.status(500).json({
      massage: "Pengajuan tidak ada",
    });
  }

  await Pengajuan.destroy();

  res.json({
    massage: "Hapus Berhasil",
    data: Pengajuan,
  });
};
const get = async (req, res) => {
  const { tanggal_akhir, tanggal_mulai } = req.query;

  let Pengajuan;
  if (tanggal_mulai && tanggal_akhir) {
    Pengajuan = await pengajuan.findAll({
      where: {
        createdAt: {
          [Op.between]: [tanggal_mulai, tanggal_akhir],
        },
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
  } else {
    Pengajuan = await pengajuan.findAll({
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
  }
  const data = Pengajuan.map((val) => {
    return {
      img: val.ktp,
      uuid: val.uuid,
      tahanan: val.tahanan.nama,
      tahanan_id: {
        value: val.tahanan.id,
        label: val.tahanan.nama,
      },
      tanggal: moment(val.createdAt, "YYYY-MM-DD").format("DD/MM/YYYY"),
      pilihan: val.pilihan,
      nama: val.nama,
      noHp: val.noHp,
      NIK: val.NIK,
      jenisKelamin: val.jenisKelamin,
      alamat: val.alamat,
      email: val.email,
      hubungan: val.hubungan,
      filesData: [
        val.files1,
        val.files2,
        val.files3,
        val.files4,
        val.files5,
        val.files6,
        val.files7,
      ],
    };
  });

  res.json({
    status: 200,
    massage: "Get data successful",
    data: data,
  });
};
const post = async (req, res) => {
  const {
    pilihan_val,
    nama,
    nik,
    jenisKelamin_val,
    alamat,
    tahanan_id,
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

  const { users_id, users_uuid } = req.user;

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

  // const fileUpload = (files, type, dirname) => {
  //   if (files) {
  //     let nameFile = "/upload/" + dirname + "." + files.mimetype;
  //     files.mv(nameFile);
  //     return nameFile;
  //   } else {
  //     return null;
  //   }
  // };

  const data = {
    pilihan: pilihan_val,
    uuid: uuid,
    user_id: users_id,
    nama: nama,
    NIK: nik,
    alamat: alamat,
    jenisKelamin: jenisKelamin_val,
    noHp: noHp,
    hubungan: hubungan,
    tahanan_id: tahanan_id,
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
};

module.exports = {
  get,
  put,
  post,
  del,
  getId,
  putId,
};
