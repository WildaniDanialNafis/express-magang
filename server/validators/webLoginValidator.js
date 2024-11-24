const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Function to check if the email exists in the database
const checkExistingEmail = async (email) => {
    const existingUser = await User.findUserByEmail(email);

    if (!existingUser) {
        throw new Error('Email belum terdaftar'); // Throw error if email is not found
    }
    return true; // Return true if email exists
};

// Function to check if the password is valid
const checkValidPassword = async (password, { req }) => {
    const { email } = req.body;

    const existingUser = await User.findUserByEmail(email);
    
    if (!existingUser) {
        throw new Error('Email belum terdaftar');
    }

    const pepper = process.env.PEPPER || 'defaultPepperValue';
    const passwordWithPepper = password + pepper;

    const isPasswordValid = await bcrypt.compare(passwordWithPepper, existingUser.password);

    if (!isPasswordValid) {
        throw new Error('Password salah'); // Reject with error if password is incorrect
    }
};

// Express Validator middleware for login validation
const webloginValidator = [
    check('email')
        .notEmpty().withMessage('Email harus diisi')
        .isEmail().withMessage('Email tidak valid')
        .custom(checkExistingEmail), // Custom email validation

    check('password')
        .notEmpty().withMessage('Password harus diisi')
        .custom(checkValidPassword), // Custom password validation
];

// Middleware for handling validation results
const validateWebLogin = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    webloginValidator,
    validateWebLogin
};
