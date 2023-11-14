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

    return queryInterface.bulkInsert("permission", [
      {
        user_id: 1,
        name: "Admin",
        view: "all",
        data: JSON.stringify([
          {
            check: true,
            label: "Dashboards",
            data: [
              {
                name: "scanning[]",
                label: "Scanning",
                link: "/scanning",
                checklist: ["view", "create", "edit", "delete"],
              },
            ],
          },
          {
            check: true,
            label: "Accounts",
            data: [
              {
                name: "users[]",
                label: "Users",
                link: "/users",
                checklist: ["view", "create", "edit", "delete"],
              },
              {
                name: "permission[]",
                label: "Permission",
                link: "/permission",
                checklist: ["view", "create", "edit", "delete"],
              },
            ],
          },
          {
            check: true,
            label: "Fitur",
            data: [
              {
                name: "tahanan[]",
                label: "Tahanan",
                link: "/tahanan",
                checklist: ["view", "create", "edit", "delete"],
              },
              {
                name: "kunjungan[]",
                label: "Kunjungan",
                link: "/kunjungan",
                checklist: ["view", "create", "edit", "delete"],
              },
              {
                name: "titipan[]",
                label: "Titipan",
                link: "/titipan",
                checklist: ["view", "create", "edit", "delete"],
              },
            ],
          },
        ]),
        uuid: Crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    return queryInterface.bulkDelete("permission", null, {});
  },
};
