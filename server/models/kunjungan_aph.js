"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class kunjungan_aph extends Model {
    static associate(models) {
      // UBAH RELASI KE BELONGS TO MANY
      this.belongsToMany(models.tahanan, {
        through: "kunjungan_aph_tahanan",
        as: "tahanans", // <-- alias diubah menjadi jamak (plural)
        foreignKey: "kunjungan_id",
        otherKey: "tahanan_id",
      });
    }
  }
  kunjungan_aph.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // TAHANAN_ID DIHAPUS DARI MODEL
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      noHp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      antrian: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      waktuKunjungan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      NIA: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lembaga: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tujuan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      selfi: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      suratTugas: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "kunjungan_aph",
      tableName: "kunjungan_aph",
      freezeTableName: true,
    },
  );
  return kunjungan_aph;
};
