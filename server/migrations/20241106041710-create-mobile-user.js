'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Membuat tabel Mobile_Users dengan kolom-kolom yang diperlukan
    await queryInterface.createTable('Mobile_Users', {
      id: {
        allowNull: false,
        autoIncrement: true,  // Menandakan kolom ini auto-increment
        primaryKey: true,     // Menandakan kolom ini adalah primary key
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false, // Menandakan kolom ini wajib diisi
        unique: true,     // Menghindari duplikasi email
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,  // Menandakan kolom ini wajib diisi
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,  // Menetapkan nilai default waktu sekarang
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,  // Menetapkan nilai default waktu sekarang
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Menghapus tabel Mobile_Users jika migrasi dibatalkan
    await queryInterface.dropTable('Mobile_Users');
  }
};
