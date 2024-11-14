'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Menambahkan satu data untuk tahun 2025 dengan userId = 1
    await queryInterface.bulkInsert('Data_Hpl', [
      {
        hpl: new Date('2025-01-01'),  // Tanggal HPL (perkiraan lahir) pada 1 Januari 2025
        usiaMinggu: 38,               // Usia dalam minggu
        usiaHari: 3,                  // Usia dalam hari
        sisaMinggu: 1,                // Sisa minggu kehamilan
        sisaHari: 4,                  // Sisa hari kehamilan
        userId: 1,                    // Mengaitkan data dengan userId = 1
        createdAt: new Date(),        // Waktu data dibuat
        updatedAt: new Date(),        // Waktu data diperbarui
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Menghapus data yang telah dimasukkan jika migrasi dibatalkan
    await queryInterface.bulkDelete('Data_Hpl', null, {});
  }
};
