const { check, validationResult, param } = require('express-validator');

const createHplByUsiaValidator = [
    check('minggu')
        .exists().withMessage('Minggu harus diisi')
        .isInt({ min: 1, max: 42 }).withMessage('Minggu harus antara 1 dan 42'),
    check('hari')
        .exists().withMessage('Hari harus diisi')
        .isInt({ min: 0, max: 6 }).withMessage('Hari harus antara 0 dan 6'),
];

const createHplByDateValidator = [
    check('hpl')
        .exists().withMessage('Tanggal HPL harus diisi')
        .isDate().withMessage('Tanggal HPL tidak valid')
        .custom((value) => {
            const hplDate = new Date(value);
            if (isNaN(hplDate.getTime())) {
                throw new Error('Tanggal HPL tidak valid');
            }
            return true;
        }),
];

const upadateHplByUsiaValidator = [
    param('id')
        .notEmpty()
        .withMessage('Id tidak boleh kosong')
        .isString()
        .withMessage('Id harus barupa string'),
    check('minggu')
        .exists().withMessage('Minggu harus diisi')
        .isInt({ min: 1, max: 42 }).withMessage('Minggu harus antara 1 dan 42'),
    check('hari')
        .exists().withMessage('Hari harus diisi')
        .isInt({ min: 0, max: 6 }).withMessage('Hari harus antara 0 dan 6'),
];

const updateHplByDateValidator = [
    param('id')
        .notEmpty()
        .withMessage('Id tidak boleh kosong')
        .isString()
        .withMessage('Id harus barupa string'),
    check('hpl')
        .exists().withMessage('Tanggal HPL harus diisi')
        .isDate().withMessage('Tanggal HPL tidak valid')
        .custom((value) => {
            const hplDate = new Date(value);
            if (isNaN(hplDate.getTime())) {
                throw new Error('Tanggal HPL tidak valid');
            }
            return true;
        }),
]

const deleteHplValidator = [
    param('id')
        .notEmpty()
        .withMessage('Id tidak boleh kosong')
        .isString()
        .withMessage('Id harus barupa string'),
];

const validateHpl = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    createHplByUsiaValidator,
    createHplByDateValidator,
    upadateHplByUsiaValidator,
    updateHplByDateValidator,
    deleteHplValidator,
    validateHpl
}