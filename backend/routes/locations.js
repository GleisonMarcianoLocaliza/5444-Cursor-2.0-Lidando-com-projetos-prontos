const express = require('express');
const { getAllLocations, getLocationById } = require('../controllers/locationController');

const router = express.Router();

// GET /api/locations - Buscar todos os locais
router.get('/', getAllLocations);

// GET /api/locations/:id - Buscar local por ID
router.get('/:id', getLocationById);

module.exports = router;
