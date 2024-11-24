const express = require('express');
const router = express.Router();
const { createMobileUserValidator, updateMobileUserValidator, deleteMobileUserValidator, validateMobileUser } = require('../validators/mobileUserValidator');
const { getAllMobileUser, createMobileUser, updateMobileUser, deleteMobileUser } = require('../controllers/mobileUserController');
const verifyToken = require('../middlewares/verifyTokenMiddleware');

router.use(verifyToken);

router.get('/mobile-users', getAllMobileUser);
router.post('/mobile-users/add', createMobileUserValidator, validateMobileUser, createMobileUser);
router.put('/mobile-users/edit/:id', updateMobileUserValidator, validateMobileUser, updateMobileUser);
router.delete('/mobile-users/delete/:id', deleteMobileUserValidator, validateMobileUser, deleteMobileUser);

module.exports = router;