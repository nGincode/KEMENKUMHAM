"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kunjungan", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tahanan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      noHp: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      antrian: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      NIK: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      jenisKelamin: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      alamat: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pengikutPria: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pengikutWanita: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      img: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      suratIzin: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      waktuKunjungan: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("kunjungan");
  },
};
