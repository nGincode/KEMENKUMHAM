"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class kunjungan_aph_tahanan extends Model {}
  kunjungan_aph_tahanan.init(
    {
      kunjungan_id: DataTypes.INTEGER,
      tahanan_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "kunjungan_aph_tahanan",
      tableName: "kunjungan_aph_tahanan",
      freezeTableName: true,
    },
  );
  return kunjungan_aph_tahanan;
};
