const jwt = require("jsonwebtoken");
const { hash, verify } = require("node-php-password");
const {
  User,
  tahanan,
  kunjungan,
  kunjunganKuasaHukum,
  jadwal,
} = require("../models");
const { Op } = require("sequelize");
const Crypto = require("crypto");
const numeral = require("numeral");
const moment = require("moment");

const put = async (req, res) => {
  const data = req.body;

  if (!data) {
    return res.status(400).json({
      massage: "Data not found",
    });
  }

  for (const item of data) {
    await jadwal.update(item, {
      where: {
        id: item.id,
      },
    });
  }

  res.json({
    status: 200,
    massage: "Update data success",
  });
};

const get = async (req, res) => {
  const Jadwal = await jadwal.findAll({
    order: [["id", "ASC"]],
  });

  const data = Jadwal.map((val) => {
    return {
      id: val.id,
      menu: val.menu,
      label: val.label,
      day: val.day,
      time_start: val.time_start,
      time_end: val.time_end,
    };
  });

  res.json({
    status: 200,
    massage: "Get data successful",
    data: data,
  });
};

module.exports = {
  get,
  put,
};
