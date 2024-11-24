const express = require('express');
const router = express.Router();
const { createTekananDarahValidator, updateTekananDarahValidator, deleteTekananDarahValidator, validateTekananDarah } = require('../validators/tekananDarahValidator');
const { getAllTekananDarah, createTekananDarah, updateTekananDarah, deleteTekananDarah } = require('../controllers/tekananDarahController');
const verifyToken = require('../middlewares/verifyTokenMiddleware');

router.use(verifyToken);

router.get('/tekanan-darah', getAllTekananDarah);
router.post('/tekanan-darah/add', createTekananDarahValidator, validateTekananDarah, createTekananDarah);
router.put('/tekanan-darah/edit/:id', updateTekananDarahValidator, validateTekananDarah, updateTekananDarah);
router.delete('/tekanan-darah/delete/:id', deleteTekananDarahValidator, validateTekananDarah, deleteTekananDarah);

module.exports = router;