const express = require('express');
const router = express.Router();
const { createHplByUsiaValidator, createHplByDateValidator, upadateHplByUsiaValidator, updateHplByDateValidator, deleteHplValidator, validateHpl } = require('../validators/hplValidator');
const { getAllHpl, createHplByUsia,  createHplByDate, updateHplByUsia, updateHplByDate, deleteHpl } = require('../controllers/hplController');
const verifyToken = require('../middlewares/verifyTokenMiddleware');

router.use(verifyToken);

router.get('/hpl', getAllHpl);
router.post('/hpl-usia/add', createHplByUsiaValidator, validateHpl, createHplByUsia);
router.post('/hpl-date/add', createHplByDateValidator, validateHpl, createHplByDate);
router.put('/hpl-usia/edit/:id', upadateHplByUsiaValidator, validateHpl, updateHplByUsia);
router.put('/hpl-date/edit/:id', updateHplByDateValidator, validateHpl, updateHplByDate);
router.delete('/hpl/delete/:id', deleteHplValidator, validateHpl, deleteHpl);

module.exports = router;