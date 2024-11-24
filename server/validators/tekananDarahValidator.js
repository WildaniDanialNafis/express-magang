const { check, validationResult, param } = require('express-validator');

const createTekananDarahValidator = [
    check('sistolik')
        .notEmpty().withMessage('Sistolik tidak boleh kosong')
        .isNumeric().withMessage('Sistolik harus berupa angka'),
    check('diastolik')
        .notEmpty().withMessage('Diastolik tidak boleh kosong')
        .isNumeric().withMessage('Diastolik harus berupa angka'),
];

const updateTekananDarahValidator = [
    param('id')
        .notEmpty().withMessage('Id tidak boleh kosong')
        .isString().withMessage('Id harus berupa string'),
    check('sistolik')
        .notEmpty().withMessage('Sistolik tidak boleh kosong')
        .isNumeric().withMessage('Sistolik harus berupa angka'),
    check('diastolik')
        .notEmpty().withMessage('Diastolik tidak boleh kosong')
        .isNumeric().withMessage('Diastolik harus berupa angka'),
];

const deleteTekananDarahValidator = [
    param('id')
        .notEmpty().withMessage('Id tidak boleh kosong')
        .isString().withMessage('Id harus berupa string'),
];

const validateTekananDarah = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    createTekananDarahValidator,
    updateTekananDarahValidator,
    deleteTekananDarahValidator,
    validateTekananDarah
};