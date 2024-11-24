const { check, validationResult, param } = require('express-validator');

const createBeratBadanValidator = [
    check('beratBadan')
        .notEmpty().withMessage('Berat badan tidak boleh kosong')
        .isNumeric().withMessage('Berat badan harus berupa angka'),
];

const updateBeratBadanValidator = [
    param('id')
        .notEmpty().withMessage('ID tidak boleh kosong')
        .isString().withMessage('ID harus berupa string'),
    check('beratBadan')
        .notEmpty().withMessage('Berat badan tidak boleh kosong')
        .isNumeric().withMessage('Berat badan harus berupa angka'),
];

const deleteBeratBadanValidator = [
    param('id')
        .notEmpty().withMessage('ID tidak boleh kosong')
        .isString().withMessage('ID harus berupa string'),
];

const validateBeratBadan = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { 
    createBeratBadanValidator, 
    updateBeratBadanValidator, 
    deleteBeratBadanValidator, 
    validateBeratBadan
};
