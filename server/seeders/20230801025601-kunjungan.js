"use strict";
const Password = require("node-php-password");
const Crypto = require("crypto");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    let data = [];
    for (let index = 0; index < 100; index++) {
      data.push({
        user_id: 0,
        tahanan_id: 1,
        tahanan_id: 1,
        nama: "nama " + index,
        noHp: 0,
        NIK: 0,
        antrian: index + 1,
        jenisKelamin: "Laki-Laki",
        alamat: 0,
        pengikutPria: index,
        pengikutWanita: index,
        waktuKunjungan: "2023-11-20",
        uuid: Crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert("kunjungan", data);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    return queryInterface.bulkDelete("kunjungan", null, {});
  },
};
