const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('./db'); // Import koneksi MySQL
const jwt_decode = require('jwt-decode');
const MobileUser = require('./models/MobileUser');
const webLoginRoutes = require('./routes/webLoginRoute');
const mobileRoutes = require('./routes/mobileUserRoute');
const hplRoutes = require('./routes/hplRoutes');
const beratBadanRoutes = require('./routes/beratBadanRoute');
const tekananDarahRoutes = require('./routes/tekananDarahRoute');

const app = express();
const port = 5000;

app.use(cors());  // Mengaktifkan CORS
app.use(bodyParser.json()); // Parsing body JSON

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


// Endpoint login untuk menghasilkan Bearer Token
app.use('/api', webLoginRoutes);

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

// Mobile User
app.use('/api', mobileRoutes);

// Hpl
app.use('/api', hplRoutes);

// Berat Badan
app.use('/api', beratBadanRoutes);

// Tekanan darah
app.use('/api', tekananDarahRoutes);

// Menjalankan server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
