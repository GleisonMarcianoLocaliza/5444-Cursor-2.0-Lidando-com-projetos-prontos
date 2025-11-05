const express = require('express');
const { getReservations, getReservationById, createReservation, cancelReservation } = require('../controllers/reservationsController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Todas as rotas de reservas requerem autenticação
router.use(authenticateToken);

// GET /reservations - Listar reservas do usuário
router.get('/', getReservations);

// GET /reservations/:id - Buscar reserva específica
router.get('/:id', getReservationById);

// POST /reservations - Criar nova reserva
router.post('/', createReservation);

// DELETE /reservations/:id - Cancelar reserva
router.delete('/:id', cancelReservation);

module.exports = router;

