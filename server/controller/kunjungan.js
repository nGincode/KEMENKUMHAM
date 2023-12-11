const jwt = require("jsonwebtoken");
const { hash, verify } = require("node-php-password");
const { User, tahanan, kunjungan } = require("../models");
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
    pengikutDewasa,
    pengikutAnak,
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
        __dirname +
          `/../../public/upload/kunjungan/${moment().format(
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
        "/upload/kunjungan/" +
        moment().format("YYYY-MM-DD") +
        "_" +
        uuid +
        "." +
        type;
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
    pengikutDewasa: pengikutDewasa,
    pengikutAnak: pengikutAnak,
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

  const Kunjungan = await kunjungan.findOne({
    where: { uuid: uuid },
  });

  if (!Kunjungan) {
    return res.status(500).json({
      massage: "Kunjungan tidak ada",
    });
  }

  await Kunjungan.destroy();

  res.json({
    massage: "Hapus Berhasil",
    data: Kunjungan,
  });
};
const get = async (req, res) => {
  const { tanggal_akhir, tanggal_mulai } = req.query;

  let Kunjungan;
  if (tanggal_mulai && tanggal_akhir) {
    Kunjungan = await kunjungan.findAll({
      where: {
        waktuKunjungan: {
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
    Kunjungan = await kunjungan.findAll({
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
  const data = Kunjungan.map((val) => {
    return {
      img: val.img,
      uuid: val.uuid,
      waktuKunjungan: moment(val.waktuKunjungan, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      ),
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
      pengikutDewasa: val.pengikutDewasa,
      pengikutAnak: val.pengikutAnak,
      antrian: val.antrian,
      suratIzin: val.suratIzin,
      hubungan: val.hubungan,
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
    waktuKunjungan,
    NIK,
    alamat,
    jenisKelamin,
    pengikut,
    tahanan_id,
    img,
    noHp,
    suratIzin,
    hubungan,
  } = req.body;
  const { users_id, users_uuid } = req.user;

  const antrian = await kunjungan.findAll({
    where: {
      waktuKunjungan: waktuKunjungan,
    },
  });

  const uuid = Crypto.randomUUID();
  let type = null;
  if (img) {
    type = img.split(";")[0].split("/")[1];
    require("fs").writeFile(
      __dirname +
        `/../../public/upload/kunjungan/${moment().format(
          "YYYY-MM-DD"
        )}_${uuid}.${type}`,
      new Buffer.from(img.replace(/^data:image\/\w+;base64,/, ""), "base64"),
      (err) => {
        console.log(err);
      }
    );
  }

  let type2 = null;
  if (suratIzin) {
    type2 = suratIzin.split(";")[0].split("/")[1];
    require("fs").writeFile(
      __dirname +
        `/../../public/upload/kunjungan/${moment().format(
          "YYYY-MM-DD"
        )}_${uuid}_suratIzin.${type2}`,
      new Buffer.from(
        suratIzin.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
      (err) => {
        console.log(err);
      }
    );
  }

  const data = {
    uuid: uuid,
    waktuKunjungan: waktuKunjungan,
    user_id: users_id,
    nama: nama,
    NIK: NIK,
    alamat: alamat,
    jenisKelamin: jenisKelamin,
    pengikutDewasa: pengikut.dewasa,
    pengikutAnak: pengikut.anak,
    tahanan_id: tahanan_id,
    noHp: noHp,
    antrian: antrian.length + 1,
    img: img
      ? "/upload/kunjungan/" +
        moment().format("YYYY-MM-DD") +
        "_" +
        uuid +
        "." +
        type
      : null,
    suratIzin: suratIzin
      ? "/upload/kunjungan/" +
        moment().format("YYYY-MM-DD") +
        +"_" +
        uuid +
        "_suratIzin." +
        type2
      : null,
    hubungan: hubungan,
  };

  await kunjungan.create(data);

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
