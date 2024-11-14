'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Menambahkan data dummy ke tabel Berat_Badan
    await queryInterface.bulkInsert('Berat_Badan', [
      {
        beratBadan: 65.5,  // Berat badan dalam kg
        userId: 1,         // ID pengguna (pastikan userId ini ada di tabel Mobile_Users)
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        beratBadan: 55.5,  // Berat badan dalam kg
        userId: 2,         // ID pengguna (pastikan userId ini ada di tabel Mobile_Users)
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Menghapus data dummy yang ditambahkan (untuk rollback)
    await queryInterface.bulkDelete('Berat_Badan', null, {});
  }
};
