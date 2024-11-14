// db.js
const mysql = require('mysql2');

// Koneksi ke MySQL
const connection = mysql.createConnection({
  host: 'web-ibu-hamil-mysql-1', // Ganti dengan host MySQL Anda (misalnya 'localhost' atau IP address container Docker)
  user: 'cinnamon', // Username MySQL Anda
  password: 'Tuhiu2003', // Password MySQL Anda
  database: 'db-ibu-hamil', // Nama database yang ingin digunakan
});

// Menyambungkan ke database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

module.exports = connection;
