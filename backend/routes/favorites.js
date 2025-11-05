const express = require('express');
const { getFavorites, addFavorite, removeFavorite, isFavorite } = require('../controllers/favoritesController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Todas as rotas de favoritos requerem autenticação
router.use(authenticateToken);

// GET /favorites - Listar favoritos do usuário
router.get('/', getFavorites);

// POST /favorites/:carId - Adicionar favorito
router.post('/:carId', addFavorite);

// DELETE /favorites/:carId - Remover favorito
router.delete('/:carId', removeFavorite);

// GET /favorites/:carId - Verificar se carro é favorito
router.get('/:carId', isFavorite);

module.exports = router;
