const { Sequelize } = require('sequelize');
const { exec } = require('child_process');
const config = require('./config/config.json');

// Inisialisasi koneksi Sequelize
const sequelize = new Sequelize(config.development);

// Fungsi untuk menjalankan perintah shell
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
      }
      resolve(stdout);
    });
  });
}

// Fungsi untuk reset database (menghapus tabel, migrasi, dan seeding)
async function migrateFresh() {
  try {
    console.log('Menghapus semua tabel...');
    // Menggunakan sequelize untuk menghapus semua tabel
    await runCommand('docker exec web-ibu-hamil-server-1 npx sequelize-cli db:migrate:undo:all');
    console.log('Semua tabel telah dihapus.');

    console.log('Menjalankan migrasi ulang...');
    // Jalankan migrasi ulang untuk membuat tabel-tabel baru
    await runCommand('docker exec web-ibu-hamil-server-1 npx sequelize-cli db:migrate');
    console.log('Migrasi berhasil dijalankan.');

    console.log('Menjalankan seeder...');
    // Jalankan seeder untuk mengisi data awal
    await runCommand('docker exec web-ibu-hamil-server-1 npx sequelize-cli db:seed:all');
    console.log('Seeder berhasil dijalankan.');
    
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  }
}

// Jalankan migrasi dan seeder
migrateFresh();
