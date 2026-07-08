const { tahanan, kunjungan_aph } = require("../models");
const { Op } = require("sequelize");
const Crypto = require("crypto");
const moment = require("moment");

// Helper parse Tahanan IDs (karena dari form data bisa dikirim sebagai string '[]' atau array)
const parseTahananIds = (reqBody) => {
  let ids = reqBody["tahanan_id[]"] || reqBody.tahanan_id;
  if (!ids) return [];
  return Array.isArray(ids) ? ids : [ids];
};

const putId = async (req, res) => {
  const { uuid } = req.params;
  const { users_id, users_uuid } = req.user;
  const { nama, noHp, NIA, lembaga, tujuan, waktuKunjungan, image, imgDel } =
    req.body;

  const tahanan_ids = parseTahananIds(req.body);

  const Kunjungan = await kunjungan_aph.findOne({
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
          `/../../public/upload/kunjunganAph/${moment().format("YYYY-MM-DD")}_${uuid}.${type}`,
        new Buffer.from(
          image.replace(/^data:image\/\w+;base64,/, ""),
          "base64",
        ),
        (err) => {
          if (err) console.log(err);
        },
      );
      imgData = `/upload/kunjunganAph/${moment().format("YYYY-MM-DD")}_${uuid}.${type}`;
    } else {
      imgData = Kunjungan.img;
    }
  }

  const data = {
    waktuKunjungan,
    nama,
    noHp,
    img: imgData,
    NIA,
    lembaga,
    tujuan,
  };

  await Kunjungan.update(data);

  // Update relasi many-to-many secara otomatis ke tabel pivot
  if (tahanan_ids.length > 0) {
    await Kunjungan.setTahanans(tahanan_ids);
  }

  res.json({
    status: 200,
    massage: "Berhasil diubah",
    data: data,
  });
};

const del = async (req, res) => {
  const { uuid } = req.params;

  const Kunjungan = await kunjungan_aph.findOne({
    where: { uuid: uuid },
  });

  if (!Kunjungan) {
    return res.status(500).json({
      massage: "Kunjungan tidak ada",
    });
  }

  // Karena onDelete: 'CASCADE' di migration, tabel pivot otomatis terhapus
  await Kunjungan.destroy();

  res.json({
    massage: "Hapus Berhasil",
    data: Kunjungan,
  });
};

const get = async (req, res) => {
  const { tanggal_akhir, tanggal_mulai } = req.query;

  let queryOptions = {
    order: [["id", "DESC"]],
    include: [
      {
        model: tahanan,
        as: "tahanans", // Panggil dengan alias jamak sesuai relasi
        attributes: { exclude: ["uuid", "createdAt", "updatedAt"] },
      },
    ],
  };

  if (tanggal_mulai && tanggal_akhir) {
    queryOptions.where = {
      waktuKunjungan: {
        [Op.between]: [tanggal_mulai, tanggal_akhir],
      },
    };
  }

  const Kunjungan = await kunjungan_aph.findAll(queryOptions);

  const data = Kunjungan.map((val) => {
    const namaTahananGabungan =
      val.tahanans && val.tahanans.length > 0
        ? val.tahanans.map((t) => t.nama).join(", ")
        : "(Tahanan dihapus/Kosong)";

    const perkaraGabungan =
      val.tahanans && val.tahanans.length > 0
        ? val.tahanans.map((t) => t.perkara).join(", ")
        : "-";

    return {
      img: val.img,
      uuid: val.uuid,
      waktuKunjungan: moment(val.waktuKunjungan, "YYYY-MM-DD").format(
        "DD/MM/YYYY",
      ),
      nama: val.nama,
      noHp: val.noHp,
      NIA: val.NIA,
      lembaga: val.lembaga,
      tujuan: val.tujuan,

      tahanan: namaTahananGabungan,
      perkara: perkaraGabungan,
      kamar:
        val.tahanans && val.tahanans.length > 0
          ? val.tahanans.map((t) => t.kamar).join(", ")
          : "-",

      suratKuasa: val.suratKuasa,
      suratIzin: val.suratIzin,
      antrian: val.antrian,
      selfi: val.selfi,

      // Jika ReactTable butuh state tahanan_id untuk mode edit, kita bypass dengan array string
      // agar tidak dibaca sebagai object kolom tabel (tergantung spesifikasi komponen bawaanmu)
      tahanan_ids_string: val.tahanans
        ? JSON.stringify(val.tahanans.map((t) => t.id))
        : "[]",
    };
  });

  res.json({
    status: 200,
    massage: "Get data successful",
    data: data,
  });
};

const post = async (req, res) => {
  const { nama, noHp, NIA, lembaga, tujuan, waktu } = req.body;
  const { file, suratKuasa, selfi, suratIzin } = req.files;
  const { users_id } = req.user;

  const tahanan_ids = parseTahananIds(req.body);

  if (tahanan_ids.length === 0) {
    return res
      .status(400)
      .json({ status: 400, massage: "Minimal pilih 1 Warga Binaan" });
  }

  // Cek apakah ada SALAH SATU tahanan yang dipilih sudah dikunjungi di tanggal ini
  const existingVisits = await kunjungan_aph.findOne({
    where: { waktuKunjungan: waktu },
    include: [
      {
        model: tahanan,
        as: "tahanans",
        where: { id: { [Op.in]: tahanan_ids } },
      },
    ],
  });

  if (existingVisits) {
    return res.status(400).json({
      status: 400,
      massage:
        "Maaf, salah satu Warga Binaan yang dipilih telah dikunjungi hari ini.\nKembali lagi besok",
    });
  }

  const antrian =
    (await kunjungan_aph.count({ where: { waktuKunjungan: waktu } })) ?? 0;
  const uuid = Crypto.randomUUID();

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
    waktuKunjungan: waktu,
    user_id: users_id,
    nama: nama,
    NIA,
    lembaga,
    tujuan,
    noHp: noHp,
    antrian: antrian + 1,
    img: await fileUpload(
      file,
      "image",
      `/kunjunganAph/${moment().format("YYYY-MM-DD")}_${uuid}_kta_`,
    ),
    selfi: await fileUpload(
      selfi,
      "image",
      `/kunjunganAph/${moment().format("YYYY-MM-DD")}_${uuid}_selfi_`,
    ),
    suratKuasa: await fileUpload(
      suratKuasa,
      "image",
      `/kunjunganAph/${moment().format("YYYY-MM-DD")}_${uuid}_suratKuasa_`,
    ),
    suratIzin: await fileUpload(
      suratIzin,
      "image",
      `/kunjunganAph/${moment().format("YYYY-MM-DD")}_${uuid}_suratIzin_`,
    ),
  };

  // Buat data utama kunjungan terlebih dahulu
  const createdKunjungan = await kunjungan_aph.create(data);

  // Simpan data Array Tahanan ke Tabel Pivot menggunakan method otomatis Sequelize
  await createdKunjungan.addTahanans(tahanan_ids);

  res.json({
    status: 200,
    massage: "Berhasil dibuat",
    data: data,
  });
};

const getId = async (req, res) => {
  const { uuid } = req.params;
  const Kunjungan = await kunjungan_aph.findOne({
    where: { uuid: uuid },
    include: [
      {
        model: tahanan,
        as: "tahanans",
        attributes: { exclude: ["uuid", "createdAt", "updatedAt"] },
      },
    ],
  });

  if (!Kunjungan) {
    return res.json({
      message: "Kunjungan not found",
    });
  }

  res.json({
    status: 200,
    massage: "Get data successful",
    data: Kunjungan,
  });
};

module.exports = {
  get,
  post,
  del,
  getId,
  putId,
};
