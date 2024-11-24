// /controllers/mobileUserController.js
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const MobileUser = require('../models/MobileUser');

exports.getAllMobileUser = async (req, res) => {
    try {
        const users = await MobileUser.findAll();
        res.status(200).json({
            message: 'Berhasil Ambil Users',
            mobileUsers: users
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

exports.createMobileUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Enkripsi password menggunakan bcrypt
        const pepper = process.env.PEPPER || 'defaultPepperValue';
        const passwordWithPepper = password + pepper;

        bcrypt.hash(passwordWithPepper, saltRounds, async (err, hashedPassword) => {
            if (err) return res.status(500).json({ message: 'Error encrypting password', error: err });

            // Simpan pengguna dengan password yang terenkripsi
            const newUser = await MobileUser.create(email, hashedPassword);
            console.log(newUser);
            res.status(201).json({
                message: 'Berhasil Membuat Pengguna',
                mobileUser: newUser
            });  // Mengembalikan pengguna baru
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};


exports.updateMobileUser = async (req, res) => {
    const { id } = req.params;
    const { email, password } = req.body;

    if (!email && !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await MobileUser.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const pepper = process.env.PEPPER || 'defaultPepperValue';
        const passwordWithPepper = password + pepper;
        const hashedPassword = await bcrypt.hash(passwordWithPepper, saltRounds);

        // Update password
        const updatedUser = await MobileUser.update(id, email, hashedPassword, user.createdAt);
        console.log(updatedUser);

        res.status(200).json({
            message: 'Berhasil Mengubah Pengguna',
            mobileUser: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
}

exports.getMobileUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await MobileUser.findById(id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

exports.deleteMobileUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await MobileUser.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await MobileUser.deleteById(id);
        res.status(200).json({ message: 'Berhasil Menghapus Pengguna' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
}

// Fungsi update dan delete bisa disesuaikan seperti ini
