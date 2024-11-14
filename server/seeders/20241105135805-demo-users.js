'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Data yang akan dimasukkan ke dalam tabel Users
    const users = [
      {
        email: 'admin@example.com',
        password: '$2a$10$IFIyodNCUN3VXsInk.oca.qCjfbU/F6jBAwFITYF5UTDEO.nS5CPe',  // Password dalam bentuk plaintext
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Menambahkan data ke dalam tabel Users
    await queryInterface.bulkInsert('Users', users, {});
  },

  async down(queryInterface, Sequelize) {
    // Menghapus semua data dari tabel Users saat rollback migrasi
    await queryInterface.bulkDelete('Users', null, {});
  }
};
