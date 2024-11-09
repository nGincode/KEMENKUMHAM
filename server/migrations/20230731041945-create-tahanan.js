"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tahanan", {
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
      BIN: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      tanggalMasuk: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      tanggalKeluar: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      perkara: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      kamar: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      statusTahanan: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      integrasi: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      img: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("tahanan");
  },
};
