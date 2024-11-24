const express = require('express');
const router = express.Router();
const { createBeratBadanValidator, updateBeratBadanValidator, deleteBeratBadanValidator, validateBeratBadan } = require('../validators/beratBadanValidator');
const { getAllBeratBadan, createBeratBadan, updateBeratBadan, deleteBeratBadan } = require('../controllers/beratBadanController');
const verifyToken = require('../middlewares/verifyTokenMiddleware');

router.use(verifyToken); 

router.get('/berat-badan', getAllBeratBadan);
router.post('/berat-badan/add', createBeratBadanValidator, validateBeratBadan, createBeratBadan);
router.put('/berat-badan/edit/:id', updateBeratBadanValidator, validateBeratBadan, updateBeratBadan);
router.delete('/berat-badan/delete/:id', deleteBeratBadanValidator, validateBeratBadan, deleteBeratBadan);

module.exports = router;