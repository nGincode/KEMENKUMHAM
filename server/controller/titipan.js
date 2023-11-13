const jwt = require("jsonwebtoken");
const { hash, verify } = require("node-php-password");
const { User, tahanan } = require("../models");
const { Op } = require("sequelize");
const Crypto = require("crypto");
const numeral = require("numeral");
const moment = require("moment");

const getId = async (req, res) => {
  const { users_id, users_uuid, email, username } = req.user;
  const { uuid } = req.params;

  const Npwp = await stock.findOne({
    where: { uuid: uuid },
    attributes: ["uuid", "stock", "name", "phone", "address"],
  });

  if (!Npwp) {
    return res.json({
      message: "STOCK not found",
    });
  }

  res.json({
    status: 200,
    massage: "Get data successful",
    data: Npwp,
  });
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
    tanggalMasuk,
    BIN,
    kamar,
    statusTahanan,
    perkara,
    image,
    imgDel,
  } = req.body;

  const Tahanan = await tahanan.findOne({
    where: { uuid: uuid },
  });

  if (!Tahanan) {
    return res.status(400).json({
      message: "Tahanan tidak ada",
    });
  }

  if (nama !== Tahanan.nama) {
    const cek = await tahanan.findOne({ where: { nama: nama } });
    if (cek) {
      return res.status(400).json({
        massage: "Nama Tahanan telah ada",
      });
    }
  }

  let type = null;

  let imgData = null;
  if (!imgDel) {
    if (image) {
      type = image.split(";")[0].split("/")[1];
      require("fs").writeFile(
        __dirname + `/../../public/upload/tahanan/${uuid}.${type}`,
        new Buffer.from(
          image.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        ),
        (err) => {
          console.log(err);
        }
      );
      imgData = "/upload/tahanan/" + uuid + "." + type;
    } else {
      imgData = Tahanan.img;
    }
  }

  const data = {
    nama: nama,
    tanggalMasuk: tanggalMasuk,
    nama: nama,
    BIN: BIN,
    kamar: kamar,
    statusTahanan: statusTahanan,
    perkara: perkara,
    img: imgData,
  };

  await Tahanan.update(data);

  res.json({
    status: 200,
    massage: "Berhasil diubah",
    data: data,
  });
};
const del = async (req, res) => {
  const { users_id, users_uuid } = req.user;
  const { uuid } = req.params;

  const Tahanan = await tahanan.findOne({
    where: { uuid: uuid },
  });

  if (!Tahanan) {
    return res.status(200).json({
      message: "Tahanan tidak ada",
    });
  }

  await Tahanan.destroy();

  res.json({
    massage: "Hapus Berhasil",
    data: Tahanan,
  });
};
const get = async (req, res) => {
  const { users_id, users_uuid, email, username, permission } = req.user;

  const tahananDb = await tahanan.findAll({
    order: [["id", "DESC"]],
  });
  const data = tahananDb.map((val) => {
    return {
      img: val.img,
      uuid: val.uuid,
      nama: val.nama,
      BIN: val.BIN,
      kamar: val.kamar,
      tanggalMasuk: moment(val.tanggalMasuk, "YYYY-MM-DD").format("DD/MM/YYYY"),
      perkara: val.perkara,
      statusTahanan: val.statusTahanan,
    };
  });

  res.json({
    status: 200,
    massage: "Get data successful",
    data: data,
  });
};
const post = async (req, res) => {
  const { nama, tanggal, BIN, kamar, status, perkara, img } = req.body;
  const { users_id, users_uuid } = req.user;

  const cek = await tahanan.findOne({ where: { nama: nama } });

  if (cek) {
    return res.status(400).json({
      massage: "Nama telah ada",
    });
  }
  const uuid = Crypto.randomUUID();
  let type = null;
  if (img) {
    type = img.split(";")[0].split("/")[1];
    require("fs").writeFile(
      __dirname + `/../../public/upload/tahanan/${uuid}.${type}`,
      new Buffer.from(img.replace(/^data:image\/\w+;base64,/, ""), "base64"),
      (err) => {
        console.log(err);
      }
    );
  }

  const data = {
    uuid: uuid,
    tanggalMasuk: tanggal,
    user_id: users_id,
    nama: nama,
    BIN: BIN,
    kamar: kamar,
    statusTahanan: status,
    perkara: perkara,
    img: img ? "/upload/tahanan/" + uuid + "." + type : null,
  };

  await tahanan.create(data);

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
