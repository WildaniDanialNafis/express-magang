'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Membuat tabel Data_Hpl dengan kolom-kolom yang diperlukan, termasuk userId
    await queryInterface.createTable('Tekanan_Darah', {
      id: {
        allowNull: false,
        autoIncrement: true,  // Menandakan kolom ini auto-increment
        primaryKey: true,     // Menandakan kolom ini adalah primary key
        type: Sequelize.INTEGER
      },
      sistolik: {
        type: Sequelize.INTEGER,
        allowNull: false, // Menandakan kolom ini wajib diisi
      },
      diastolik: {
        type: Sequelize.INTEGER,
        allowNull: false, // Menandakan kolom ini wajib diisi
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Mobile_Users',  // Tabel yang menjadi referensi (pastikan tabel Users ada)
          key: 'id'        // Kolom yang menjadi referensi (primary key dari tabel Users)
        },
        onUpdate: 'CASCADE',  // Jika data di tabel Users diubah, perubahan diterapkan ke Data_Hpl
        onDelete: 'CASCADE'   // Jika data di tabel Users dihapus, data terkait di Data_Hpl juga dihapus
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
    // Menghapus tabel Data_Hpl jika migrasi dibatalkan
    await queryInterface.dropTable('Tekanan_Darah');
  }
};
