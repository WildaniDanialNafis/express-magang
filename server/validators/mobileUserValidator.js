const { check, validationResult, param } = require('express-validator');
const MobileUser = require('../models/MobileUser');

const checkDuplicateEmail = async (email) => {

    const existingUser = await MobileUser.findByEmail(email);
    if (existingUser) {
        if (existingUser.email == email) {
            return true;
        }
        throw new Error('Email sudah terdaftar');
    }
    return true;
};

const createMobileUserValidator = [
    check('email')
        .notEmpty().withMessage('Email tidak boleh kosong')
        .isEmail().withMessage('Email Tidak Valid')
        .custom(checkDuplicateEmail),
    check('password')
        .notEmpty().withMessage('Password Harus Diisi'),
];

const updateMobileUserValidator = [
    param('id')
        .notEmpty().withMessage('Id tidak boleh kosong')
        .isString().withMessage('Id harus berupa string'),
    check('email')
        .notEmpty().withMessage('Email tidak boleh kosong')
        .isEmail().withMessage('Email Tidak Valid')
        .custom(checkDuplicateEmail),
    check('password')
        .notEmpty().withMessage('Password Harus Diisi')
]

const deleteMobileUserValidator = [
    param('id')
        .notEmpty().withMessage('Id tidak boleh kosong')
        .isString().withMessage('Id harus berupa string'),
]

const validateMobileUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });  // Fix: Call errors.array() as a method
    }
    next();
}

module.exports = {
    createMobileUserValidator,
    updateMobileUserValidator,
    deleteMobileUserValidator,
    validateMobileUser
};
