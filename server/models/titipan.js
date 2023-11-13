"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class titipan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  titipan.init(
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
      tahanan_id: {
        type: DataTypes.INTEGER,
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
      keterangan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING,
      },
      waktuKunjungan: {
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
    },
    {
      sequelize,
      modelName: "titipan",
      tableName: "titipan",
      // timestamps: true,
      freezeTableName: true,
      // createdAt: "created_at",
      // updatedAt: "updated_at",
    }
  );
  return titipan;
};
