const express = require('express');
const router = express.Router();
const {
  getAllCars,
  getRandomCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
} = require('../controllers/carController');

// GET /car - Listar todos os carros (com filtro opcional por categoria)
router.get('/', getAllCars);

// GET /car/random - Buscar carros aleatórios
router.get('/random', getRandomCars);

// GET /car/:id - Buscar carro por ID
router.get('/:id', getCarById);

// POST /car - Criar novo carro
router.post('/', createCar);

// PUT /car/:id - Atualizar carro
router.put('/:id', updateCar);

// DELETE /car/:id - Deletar carro
router.delete('/:id', deleteCar);

module.exports = router;
