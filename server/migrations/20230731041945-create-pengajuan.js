"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pengajuan", {
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
      pilihan: {
        type: Sequelize.STRING,
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
      hubungan: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ktp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      files1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      files2: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      files3: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      files4: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      files5: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      files6: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      files7: {
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
    await queryInterface.dropTable("pengajuan");
  },
};
