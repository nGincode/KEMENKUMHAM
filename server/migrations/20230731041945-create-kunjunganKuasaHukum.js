"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kunjunganKuasaHukum", {
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
      waktuKunjungan: {
        type: Sequelize.DATEONLY,
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
      NIA: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lembaga: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tujuan: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      img: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      selfi: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      suratKuasa: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      suratIzin: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable("kunjunganKuasaHukum");
  },
};
