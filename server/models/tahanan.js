"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tahanan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.kunjungan, {
        as: "kunjungan",
        foreignKey: "tahanan_id",
      });
      this.hasMany(models.kunjungan_kuasa_hukum, {
        as: "kunjunganKuasaHukum",
        foreignKey: "tahanan_id",
      });
    }
  }
  tahanan.init(
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
      BIN: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      tanggalMasuk: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      tanggalKeluar: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      perkara: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      kamar: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      statusTahanan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING,
      },
      integrasi: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      penampilan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "tahanan",
      tableName: "tahanan",
      // timestamps: true,
      freezeTableName: true,
      // createdAt: "created_at",
      // updatedAt: "updated_at",
    },
  );
  return tahanan;
};
