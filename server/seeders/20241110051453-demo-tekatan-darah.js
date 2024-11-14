'use strict';

/** @type {import('sequelize-cli').Seed} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Menambahkan dua record untuk userId 1 dan 2
    await queryInterface.bulkInsert('Tekanan_Darah', [
      {
        sistolik: 120,
        diastolik: 80,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        sistolik: 130,
        diastolik: 85,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Menghapus semua data di tabel Tekanan_Darah
    await queryInterface.bulkDelete('Tekanan_Darah', null, {});
  }
};
