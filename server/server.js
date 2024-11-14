const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('./db'); // Import koneksi MySQL
const jwt_decode = require('jwt-decode');
const MobileUser = require('./models/MobileUser');
const mobileUserController = require('./controllers/mobileUserController');
const hplController = require('./controllers/hplController');

const app = express();
const port = 5000;

app.use(cors());  // Mengaktifkan CORS
app.use(bodyParser.json()); // Parsing body JSON

// Simulasi database (sebaiknya menggunakan database sesungguhnya)
const users = [
    {
        id: 1,
        username: 'john',
        password: bcrypt.hashSync('123456', 10), // Enkripsi password
    }
];

// Secret key untuk JWT
let JWT_SECRET = 'your_jwt_secret';

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log(token);

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    // Token dikirim dalam format 'Bearer <token>'
    const tokenWithoutBearer = token.split(' ')[1];

    jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const userId = decoded.id;
        console.log('User ID from decoded token:', userId);
        req.userId = decoded.id; // Menyimpan userId ke dalam req untuk digunakan di rute selanjutnya
        next();
    });
};


// Contoh rute yang dilindungi
app.get('/api/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route' });
});

// Endpoint login untuk menghasilkan Bearer Token
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and Password are required' });
    }

    try {
        const [rows] = await connection.promise().query('SELECT * FROM Users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = rows[0];
        const pepper = process.env.PEPPER || 'defaultPepperValue';
        const passwordWithPepper = password + pepper;

        const isPasswordValid = await bcrypt.compare(passwordWithPepper, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const payload = { id: user.id, email: user.email };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            user: { id: user.id, email: user.email },
            token,
        });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});


// Mobile User
app.get('/api/mobile_users', verifyToken, mobileUserController.getAllUsers);
app.post('/api/mobile_users/add', verifyToken, mobileUserController.createUser);
app.put('/api/mobile_users/edit/:id', verifyToken, mobileUserController.updateUser);
app.delete('/api/mobile_users/delete/:id', verifyToken, mobileUserController.deleteUser);

// Hpl
app.get('/api/hpl', verifyToken, hplController.getAllHpl);
app.post('/api/hpl/add', verifyToken, hplController.createHpl);

app.post('/api/mobile_login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and Password are required' });
    }

    try {
        const [rows] = await connection.promise().query('SELECT * FROM Mobile_Users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = rows[0];
        const pepper = process.env.PEPPER || 'defaultPepperValue';
        const passwordWithPepper = password + pepper;

        const isPasswordValid = await bcrypt.compare(passwordWithPepper, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const payload = { id: user.id, email: user.email };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            user: { id: user.id, email: user.email },
            token,
        });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});


app.post('/api/mobile_users/get_token', (req, res) => {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email, dan Password wajib diisi' });
    }

    try {
        const payload = {
            email: email,
            password: password,
        };

        // Tanda tangani JWT (gunakan secret key yang aman dan tersimpan di variabel lingkungan)
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token berlaku 1 jam

        // Kembalikan response dengan data pengguna yang baru ditambahkan
        res.status(201).json({
            message: 'Token berhasil didapatkan',
            token: token
        });
    } catch (err) {
        // Menambahkan log untuk error lebih rinci
        console.error('Error inserting user:', err);
        return res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
    }
});


// Endpoint untuk menghitung HPL dan memasukkan data ke database menggunakan async/await


app.post('/hitung-hpl/edit', verifyToken, async (req, res) => {
    const { minggu, hari } = req.body;  // Mengambil ID, minggu, dan hari dari body request
    console.log('User ID:', req.userId);  // Log untuk memeriksa userId

    // Validasi input
    if (!minggu || !hari || isNaN(minggu) || isNaN(hari)) {
        return res.status(400).json({ error: 'Usia kehamilan dalam minggu dan hari harus diisi dan berupa angka' });
    }

    // Validasi rentang minggu dan hari
    if (minggu < 1 || minggu > 42 || hari < 0 || hari > 6) {
        return res.status(400).json({ error: 'Minggu harus antara 1-42 dan hari antara 0-6' });
    }

    try {
        // Menghitung total hari kehamilan
        const totalHariKehamilan = (minggu * 7) + hari;  // Total hari kehamilan

        // Menghitung sisa hari untuk mencapai 280 hari
        const sisaHari = 280 - totalHariKehamilan;

        const sisaHariMinggu = Math.floor(sisaHari / 7);  // Sisa minggu
        const sisaHariHari = sisaHari % 7;  // Sisa hari

        // Menghitung tanggal HPL (280 hari dari sekarang - sisa hari)
        const hplDate = new Date();
        hplDate.setDate(hplDate.getDate() + sisaHari);

        // Debug log untuk memastikan nilai yang dihitung benar
        console.log('Tanggal HPL:', hplDate.toISOString().split('T')[0]);

        // Periksa apakah data dengan ID yang diberikan ada
        const checkQuery = `SELECT * FROM Data_Hpl WHERE userId = ?`;
        const [rows] = await connection.promise().execute(checkQuery, [req.userId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Data HPL tidak ditemukan untuk diupdate' });
        }

        // SQL query untuk mengupdate data di tabel Data_Hpl
        const updateQuery = `UPDATE Data_Hpl 
            SET hpl = ?, usiaMinggu = ?, usiaHari = ?, sisaMinggu = ?, sisaHari = ?, updatedAt = NOW() 
            WHERE userId = ?`;

        // Menjalankan query update menggunakan db.promise()
        const [updateResult] = await connection.promise().execute(updateQuery, [
            hplDate.toISOString().split('T')[0], // Format tanggal HPL
            minggu,
            hari,
            sisaHariMinggu,
            sisaHariHari,
            req.userId  // userId yang berasal dari token
        ]);

        // Mengembalikan response yang berhasil
        res.json({
            usiaMinggu: minggu,
            usiaHari: hari,
            sisaMinggu: sisaHariMinggu,
            sisaHari: sisaHariHari,
            hpl: hplDate.toISOString().split('T')[0],
            message: 'Data berhasil diperbarui'
        });

    } catch (err) {
        // Menangani error jika terjadi kesalahan dalam menyimpan data
        console.error('Gagal memperbarui data ke database:', err.message);
        return res.status(500).json({
            error: 'Gagal memperbarui data ke database',
            message: err.message
        });
    }
});



app.post('/hitung-usia-kehamilan', verifyToken, async (req, res) => {
    const { hpl } = req.body; // Mengambil tanggal HPL yang diberikan
    console.log(`Tanggal HPL yang diberikan: ${hpl}`);

    // Validasi input: pastikan tanggal HPL ada
    if (!hpl) {
        return res.status(400).json({ error: 'Tanggal HPL harus diisi' });
    }

    // Mengonversi tanggal HPL dari string ke objek Date
    const hplDate = new Date(hpl);

    if (isNaN(hplDate.getTime())) {
        return res.status(400).json({ error: 'Format tanggal HPL tidak valid' });
    }

    // Mendapatkan tanggal saat ini
    const currentDate = new Date();

    // Menghitung jumlah hari antara tanggal HPL dan tanggal saat ini
    const differenceInTime = hplDate.getTime() - currentDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); // Menghitung selisih hari

    // Menghitung usia kehamilan dalam hari
    const usiaKehamilanHari = 280 - differenceInDays; // 280 hari adalah durasi rata-rata kehamilan

    // Menghitung usia kehamilan dalam minggu dan hari
    const usiaKehamilanMinggu = Math.floor(usiaKehamilanHari / 7);
    const usiaKehamilanSisaHari = usiaKehamilanHari % 7;

    console.log(usiaKehamilanHari);
    console.log(usiaKehamilanMinggu);
    console.log(usiaKehamilanSisaHari);

    // Menghitung sisa hari menuju HPL
    const sisaHari = differenceInDays;

    const sisaMinggu = Math.floor(sisaHari / 7);

    const sisaHariHari = sisaHari % 7;

    // SQL query untuk memasukkan data ke tabel Data_Hpl
    const query = `INSERT INTO Data_Hpl (hpl, usiaMinggu, usiaHari, sisaMinggu, sisaHari, userId, createdAt, updatedAt) 
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    // Menjalankan query menggunakan db.promise()
    const [results] = await connection.promise().execute(query, [
        hplDate.toISOString().split('T')[0], // Format tanggal HPL
        usiaKehamilanMinggu,
        usiaKehamilanSisaHari,
        sisaMinggu,
        sisaHariHari,
        req.userId // userId yang berasal dari token
    ]);

    // Mengembalikan hasil perhitungan
    return res.json({
        usiaMinggu: usiaKehamilanMinggu,
        usiaHari: usiaKehamilanSisaHari,
        sisaMinggu: sisaMinggu, // Sisa hari menuju HPL
        sisaHari: sisaHariHari, // Sisa hari menuju HPL
        hpl: hplDate.toISOString().split('T')[0], // Mengembalikan tanggal HPL dalam format YYYY-MM-DD
    });
});

app.post('/usia-kehamilan/edit', verifyToken, async (req, res) => {
    const { hpl } = req.body;  // Mengambil tanggal HPL dari body request
    console.log('User ID:', req.userId);  // Log untuk memeriksa userId

    // Validasi input: pastikan tanggal HPL ada
    if (!hpl) {
        return res.status(400).json({ error: 'Tanggal HPL harus diisi' });
    }

    // Mengonversi tanggal HPL dari string ke objek Date
    const hplDate = new Date(hpl);

    if (isNaN(hplDate.getTime())) {
        return res.status(400).json({ error: 'Format tanggal HPL tidak valid' });
    }

    try {
        // Mendapatkan tanggal saat ini
        const currentDate = new Date();

        // Menghitung jumlah hari antara tanggal HPL dan tanggal saat ini
        const differenceInTime = hplDate.getTime() - currentDate.getTime();
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); // Menghitung selisih hari

        // Menghitung usia kehamilan dalam hari
        const usiaKehamilanHari = 280 - differenceInDays; // 280 hari adalah durasi rata-rata kehamilan

        // Menghitung usia kehamilan dalam minggu dan hari
        const usiaKehamilanMinggu = Math.floor(usiaKehamilanHari / 7);
        const usiaKehamilanSisaHari = usiaKehamilanHari % 7;

        // Menghitung sisa hari menuju HPL
        const sisaHari = differenceInDays;
        const sisaMinggu = Math.floor(sisaHari / 7);
        const sisaHariHari = sisaHari % 7;

        // Debug log untuk memastikan nilai yang dihitung benar
        console.log('Tanggal HPL:', hplDate.toISOString().split('T')[0]);
        console.log('Usia Kehamilan (Minggu):', usiaKehamilanMinggu);
        console.log('Usia Kehamilan (Hari):', usiaKehamilanSisaHari);
        console.log('Sisa Minggu:', sisaMinggu);
        console.log('Sisa Hari:', sisaHariHari);

        // Periksa apakah data dengan userId yang diberikan ada di database
        const checkQuery = `SELECT * FROM Data_Hpl WHERE userId = ?`;
        const [rows] = await connection.promise().execute(checkQuery, [req.userId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Data HPL tidak ditemukan untuk diupdate' });
        }

        // SQL query untuk mengupdate data di tabel Data_Hpl
        const updateQuery = `
            UPDATE Data_Hpl
            SET hpl = ?, usiaMinggu = ?, usiaHari = ?, sisaMinggu = ?, sisaHari = ?, updatedAt = NOW()
            WHERE userId = ?`;

        // Menjalankan query update untuk menyimpan perubahan
        const [updateResult] = await connection.promise().execute(updateQuery, [
            hplDate.toISOString().split('T')[0], // Format tanggal HPL
            usiaKehamilanMinggu,                  // Usia kehamilan dalam minggu
            usiaKehamilanSisaHari,                // Usia kehamilan dalam hari
            sisaMinggu,                            // Sisa minggu menuju HPL
            sisaHariHari,                         // Sisa hari menuju HPL
            req.userId                            // userId yang berasal dari token
        ]);

        // Mengembalikan response yang berhasil
        res.json({
            usiaMinggu: usiaKehamilanMinggu,
            usiaHari: usiaKehamilanSisaHari,
            sisaMinggu: sisaMinggu,
            sisaHari: sisaHariHari,
            hpl: hplDate.toISOString().split('T')[0], // Mengembalikan tanggal HPL dalam format YYYY-MM-DD
            message: 'Data usia kehamilan berhasil diperbarui'
        });

    } catch (err) {
        // Menangani error jika terjadi kesalahan dalam menyimpan data
        console.error('Gagal memperbarui data ke database:', err.message);
        return res.status(500).json({
            error: 'Gagal memperbarui data ke database',
            message: err.message
        });
    }
});


app.get('/berat-badan', verifyToken, async (req, res) => {
    console.log(req.userId);
    try {
        // Mengambil data berdasarkan userId
        const [result] = await connection.promise().query('SELECT * FROM Berat_Badan WHERE userId = ?', [req.userId]);

        // Jika data kosong, kembalikan 404
        if (result.length === 0) {
            return res.status(404).json({ message: 'Data berat badan not found for the user' });
        }

        // Mengembalikan data yang ditemukan
        res.status(200).json({
            message: 'Data berat badan retrieved successfully',
            data: result  // hasil query adalah array, bukan single record, jadi tidak perlu result[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});


app.post('/berat-badan/add', verifyToken, async (req, res) => {
    const { berat, tanggal } = req.body;

    // Validasi input
    if (typeof berat !== 'number' || isNaN(berat)) {
        return res.status(400).json({ message: 'Berat badan harus berupa angka.' });
    }

    if (!tanggal || isNaN(new Date(tanggal).getTime())) {
        return res.status(400).json({ message: 'Tanggal tidak valid.' });
    }

    try {
        // SQL query untuk memasukkan data berat badan
        const query = `INSERT INTO Berat_Badan (beratBadan, userId, createdAt, updatedAt) 
                       VALUES (?, ?, ?, ?)`;

        // Menjalankan query menggunakan db.promise()
        const [result] = await connection.promise().execute(query, [
            berat,       // Berat badan yang diterima dari request body
            req.userId,  // userId yang berasal dari token atau session
            tanggal,
            tanggal     // Tanggal yang diterima dari request body
        ]);

        // Menangani respons setelah query berhasil
        res.status(201).json({
            message: 'Data berat badan berhasil disimpan',
            data: {
                id: result.insertId,  // Menyertakan insertId (ID yang baru dimasukkan)
                beratBadan: berat,
                createdAt: new Date().toISOString(),  // Timestamp saat data ditambahkan
                updatedAt: new Date().toISOString()   // Timestamp saat data ditambahkan
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

app.post('/berat-badan/edit', verifyToken, async (req, res) => {
    const { id, berat, tanggal } = req.body;
    console.log(req.body);

    // Validasi berat badan
    if (typeof berat !== 'number' || isNaN(berat)) {
        return res.status(400).json({ message: 'Berat badan harus berupa angka.' });
    }

    // Validasi tanggal (bisa lebih lanjut, jika perlu)
    if (tanggal && isNaN(new Date(tanggal).getTime())) {
        return res.status(400).json({ message: 'Tanggal tidak valid.' });
    }

    try {
        // Query untuk mendapatkan data berat badan
        const query = "SELECT * FROM Berat_Badan WHERE id = ?";
        const [results] = await connection.promise().execute(query, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Data berat badan tidak ditemukan untuk pengguna ini' });
        }

        console.log(results);

        // Query untuk memperbarui berat badan
        const queryUpdate = "UPDATE Berat_Badan SET beratBadan = ?, updatedAt = NOW() WHERE id = ?";
        const [resultsUpdate] = await connection.promise().execute(queryUpdate, [berat, id]);

        // Periksa apakah ada baris yang terpengaruh
        if (resultsUpdate.affectedRows === 0) {
            return res.status(404).json({ message: 'Tidak ada data yang diperbarui.' });
        }

        console.log(resultsUpdate);

        // Mengirim respons sukses
        res.status(200).json({
            message: 'Data berat badan berhasil diperbarui',
            data: {
                id: id,  // Menggunakan ID yang diterima dalam request
                beratBadan: berat,
                tanggal: new Date(tanggal).toISOString()  // Tanggal yang diterima
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: err.message });
    }
});

app.delete('/berat-badan/delete/:id', verifyToken, async (req, res) => {
    const { id } = req.params;  // Ambil id dari URL params

    console.log(id);  // Untuk memverifikasi bahwa id yang diterima sudah benar

    try {
        const query = 'DELETE FROM Berat_Badan WHERE id = ?';
        const [result] = await connection.promise().execute(query, [id]); // Gunakan id dari req.params

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Data berat badan tidak ditemukan' });
        }

        res.status(200).json({ message: 'Data berat badan berhasil dihapus' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});


app.get('/api/hpl', verifyToken, (req, res) => {
    // Query untuk mendapatkan semua pengguna
    connection.query('SELECT * FROM Data_Hpl', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Error querying the database');
            return;
        }
        res.json(results); // Kirimkan hasil query sebagai response JSON
    });
});

app.get('/api/berat_badan', verifyToken, (req, res) => {
    // Query untuk mendapatkan semua pengguna
    connection.query('SELECT * FROM Berat_Badan', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Error querying the database');
            return;
        }
        res.json(results); // Kirimkan hasil query sebagai response JSON
    });
});


app.get('/tekanan-darah', verifyToken, async (req, res) => {
    console.log(req.userId);
    try {
        // Mengambil data berdasarkan userId
        const [result] = await connection.promise().query('SELECT * FROM Tekanan_Darah WHERE userId = ?', [req.userId]);

        // Jika data kosong, kembalikan 404
        if (result.length === 0) {
            return res.status(404).json({ message: 'Data berat badan not found for the user' });
        }

        // Mengembalikan data yang ditemukan
        res.status(200).json({
            message: 'Data berat badan retrieved successfully',
            data: result  // hasil query adalah array, bukan single record, jadi tidak perlu result[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

app.post('/tekanan-darah/add', verifyToken, async (req, res) => {
    const { sistolik, diastolik, tanggal } = req.body;

    // Validasi input
    if (typeof sistolik !== 'number' || isNaN(sistolik)) {
        return res.status(400).json({ message: 'Sistolik harus berupa angka.' });
    }

    if (typeof diastolik !== 'number' || isNaN(diastolik)) {
        return res.status(400).json({ message: 'Diastolik harus berupa angka.' });
    }

    if (!tanggal || isNaN(new Date(tanggal).getTime())) {
        return res.status(400).json({ message: 'Tanggal tidak valid.' });
    }

    try {
        // SQL query untuk memasukkan data tekanan darah
        const query = `INSERT INTO Tekanan_Darah (sistolik, diastolik, userId, createdAt, updatedAt) 
                       VALUES (?, ?, ?, ?, ?)`;

        // Menjalankan query menggunakan db.promise()
        const [result] = await connection.promise().execute(query, [
            sistolik,
            diastolik,
            req.userId,  // userId yang berasal dari token atau session
            tanggal,     // Tanggal yang diterima dari request body
            tanggal      // Menggunakan tanggal input untuk updatedAt juga
        ]);

        // Menangani respons setelah query berhasil
        res.status(201).json({
            message: 'Data tekanan darah berhasil disimpan',
            data: {
                id: result.insertId,  // Menyertakan insertId (ID yang baru dimasukkan)
                sistolik: sistolik,
                diastolik: diastolik,
                createdAt: tanggal,  // Tanggal yang diterima dari request body
                updatedAt: tanggal   // Tanggal yang diterima dari request body
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

app.put('/tekanan-darah/edit/:id', verifyToken, async (req, res) => {
    const { sistolik, diastolik, tanggal } = req.body;
    const { id } = req.params;

    console.log(id);

    // Validasi input
    if (typeof sistolik !== 'number' || isNaN(sistolik)) {
        return res.status(400).json({ message: 'Sistolik harus berupa angka.' });
    }

    if (typeof diastolik !== 'number' || isNaN(diastolik)) {
        return res.status(400).json({ message: 'Diastolik harus berupa angka.' });
    }

    if (!tanggal || isNaN(new Date(tanggal).getTime())) {
        return res.status(400).json({ message: 'Tanggal tidak valid.' });
    }

    try {
        // SQL query untuk memeriksa data tekanan darah berdasarkan ID
        const query = `SELECT * FROM Tekanan_Darah WHERE id = ?`;
        const [result] = await connection.promise().execute(query, [id]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Data tekanan darah tidak ditemukan' });
        }

        // SQL query untuk memperbarui data tekanan darah
        const queryUpdate = `
            UPDATE Tekanan_Darah 
            SET sistolik = ?, diastolik = ?, updatedAt = NOW() 
            WHERE id = ?
        `;

        // Menjalankan query update
        const [resultsUpdate] = await connection.promise().execute(queryUpdate, [
            sistolik,
            diastolik,
            id
        ]);

        // Periksa apakah data berhasil diperbarui
        if (resultsUpdate.affectedRows === 0) {
            return res.status(404).json({ message: 'Tidak ada perubahan pada data tekanan darah' });
        }

        // Mengirimkan respons berhasil
        res.status(200).json({
            message: 'Data tekanan darah berhasil diperbarui',
            data: {
                id: id, // ID yang diperbarui
                sistolik: sistolik,
                diastolik: diastolik,
                createdAt: result[0].createdAt, // Menggunakan tanggal pembuatan asli dari data
                updatedAt: new Date() // Waktu pembaruan baru
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

app.delete('/tekanan-darah/delete/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try {
        const query = `DELETE FROM Tekanan_Darah WHERE id = ?`;
        const [result] = await connection.promise().execute(query, [id]);

        res.status(200).json({
            message: 'Data tekanan darah berhasil dihapus',
            data: {
                id: id, // ID yang dihapus
                deletedAt: new Date() // Waktu penghapusan baru
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
