"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class kunjungan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.tahanan, {
        as: "tahanan",
        foreignKey: "tahanan_id",
      });
    }
  }
  kunjungan.init(
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
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tahanan_id: {
        type: DataTypes.INTEGER,
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
      NIK: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      jenisKelamin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alamat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pengikutDewasa: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pengikutAnak: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      suratIzin: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      waktuKunjungan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hubungan: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "kunjungan",
      tableName: "kunjungan",
      // timestamps: true,
      freezeTableName: true,
      // createdAt: "created_at",
      // updatedAt: "updated_at",
    }
  );
  return kunjungan;
};
