"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class pengajuan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  pengajuan.init(
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
      pilihan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      noHp: {
        type: DataTypes.STRING,
        allowNull: false,
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
      hubungan: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ktp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      files1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      files2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      files3: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      files4: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      files5: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      files6: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      files7: {
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
      modelName: "pengajuan",
      tableName: "pengajuan",
      // timestamps: true,
      freezeTableName: true,
      // createdAt: "created_at",
      // updatedAt: "updated_at",
    }
  );
  return pengajuan;
};
