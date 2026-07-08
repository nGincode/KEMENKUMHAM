"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kunjungan_aph_tahanan", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      kunjungan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "kunjungan_aph",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      tahanan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tahanan",
          key: "id",
        },
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("kunjungan_aph_tahanan");
  },
};
