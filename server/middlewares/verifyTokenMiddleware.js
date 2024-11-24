const jwt = require('jsonwebtoken');

let JWT_SECRET = 'your_jwt_secret';

// Middleware untuk memverifikasi token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log(token);

    // Periksa apakah token ada
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    // Token dikirim dalam format 'Bearer <token>'
    const tokenWithoutBearer = token.split(' ')[1];

    // Verifikasi token
    jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        
        // Jika token valid, simpan userId dari decoded token ke dalam req
        const userId = decoded.id;
        console.log('User ID from decoded token:', userId);
        req.userId = decoded.id; // Menyimpan userId ke dalam req untuk digunakan di rute selanjutnya
        next();
    });
};

module.exports = verifyToken;