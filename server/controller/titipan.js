const jwt = require("jsonwebtoken");
const { hash, verify } = require("node-php-password");
const { titipan, tahanan, kunjungan } = require("../models");
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
    tanggal,
    nama,
    hubungan,
    NIK,
    alamat,
    jenisKelamin,
    tahanan_id,
    noHp,
    keterangan,
    image,
    imgDel,
  } = req.body;

  const Titipan = await titipan.findOne({
    where: { uuid: uuid },
  });

  if (!Titipan) {
    return res.status(400).json({
      massage: "Titipan tidak ada",
    });
  }

  let type = null;

  let imgData = null;
  if (!imgDel) {
    if (image) {
      type = image.split(";")[0].split("/")[1];
      require("fs").writeFile(
        __dirname +
          `/../../public/upload/titipan/${moment().format(
            "YYYY-MM-DD"
          )}_${uuid}.${type}`,
        new Buffer.from(
          image.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        ),
        (err) => {
          console.log(err);
        }
      );
      imgData =
        "/upload/titipan/" +
        moment().format("YYYY-MM-DD") +
        "_" +
        uuid +
        "." +
        type;
    } else {
      imgData = Titipan.img;
    }
  }

  const data = {
    hubungan: hubungan,
    nama: nama,
    NIK: NIK,
    alamat: alamat,
    jenisKelamin: jenisKelamin,
    keterangan: keterangan,
    tahanan_id: tahanan_id,
    noHp: noHp,
    img: imgData,
    tanggal: tanggal,
  };

  await Titipan.update(data);

  res.json({
    status: 200,
    massage: "Berhasil diubah",
    data: data,
  });
};
const del = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const { uuid } = req.params;

  const Titipan = await titipan.findOne({
    where: { uuid: uuid },
  });

  if (!Titipan) {
    return res.status(500).json({
      massage: "Titipan tidak ada",
    });
  }

  await Titipan.destroy();

  res.json({
    massage: "Hapus Berhasil",
    data: Titipan,
  });
};
const get = async (req, res) => {
  const { tanggal_akhir, tanggal_mulai } = req.query;
  let Titipan;
  if (tanggal_mulai && tanggal_akhir) {
    Titipan = await titipan.findAll({
      where: {
        createdAt: {
          [Op.between]: [
            moment(tanggal_mulai, "YYYY-MM-DD").format("YYYY-MM-DD"),
            moment(tanggal_akhir, "YYYY-MM-DD").format("YYYY-MM-DD"),
          ],
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
    Titipan = await titipan.findAll({
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
  const data = Titipan.map((val) => {
    return {
      img: val.img,
      uuid: val.uuid,
      tanggal: moment(val.tanggal).format("DD/MM/YYYY"),
      tahanan: val.tahanan.nama,
      tahanan_id: {
        value: val.tahanan.id,
        label: val.tahanan.nama,
      },
      kamar: val.tahanan.kamar,
      perkara: val.tahanan.perkara,
      nama: val.nama,
      noHp: val.noHp,
      NIK: val.NIK,
      jenisKelamin: val.jenisKelamin,
      alamat: val.alamat,
      hubungan: val.hubungan,
      antrian: val.antrian,
      keterangan: val.keterangan,
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
    nama,
    hubungan,
    NIK,
    alamat,
    jenisKelamin,
    tahanan_id,
    img,
    noHp,
    ket,
    tanggal,
  } = req.body;
  const { users_id, users_uuid } = req.user;

  const uuid = Crypto.randomUUID();
  let type = null;
  if (img) {
    type = img.split(";")[0].split("/")[1];
    require("fs").writeFile(
      __dirname +
        `/../../public/upload/titipan/${moment().format(
          "YYYY-MM-DD"
        )}_${uuid}.${type}`,
      new Buffer.from(img.replace(/^data:image\/\w+;base64,/, ""), "base64"),
      (err) => {
        console.log(err);
      }
    );
  }

  const data = {
    uuid: uuid,
    hubungan: hubungan,
    user_id: users_id,
    nama: nama,
    NIK: NIK,
    alamat: alamat,
    jenisKelamin: jenisKelamin,
    keterangan: ket,
    tahanan_id: tahanan_id,
    noHp: noHp,
    tanggal: tanggal,
    img: img
      ? "/upload/titipan/" +
        moment().format("YYYY-MM-DD") +
        "_" +
        uuid +
        "." +
        type
      : null,
  };

  await titipan.create(data);

  res.json({
    status: 200,
    massage: "Berhasil dibuat",
    data: data,
  });
};

module.exports = {
  get,
  put,
  post,
  del,
  getId,
  putId,
};
