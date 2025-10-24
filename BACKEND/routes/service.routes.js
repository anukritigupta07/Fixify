const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');

router.get('/', serviceController.getAllServices);
router.post('/create', serviceController.createService);
router.get('/provider/:providerId', serviceController.getServicesByProvider);

module.exports = router;
