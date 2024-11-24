const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

let JWT_SECRET = 'your_jwt_secret'; // Ensure this is set properly

exports.getUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findUserByEmail(email);

        const payload = { id: user.id, email: user.email };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            user: { id: user.id, email: user.email },
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
}
