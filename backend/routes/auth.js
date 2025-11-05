const express = require('express');
const { register, login, getCurrentUser, validatePassword, updateProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /auth/register - Registrar usuário
router.post('/register', register);

// POST /auth/login - Login
router.post('/login', login);

// GET /auth/me - Obter dados do usuário atual (requer autenticação)
router.get('/me', authenticateToken, getCurrentUser);

// POST /auth/validate-password - Validar senha atual (requer autenticação)
router.post('/validate-password', authenticateToken, validatePassword);

// PUT /auth/update-profile - Atualizar perfil (requer autenticação)
router.put('/update-profile', authenticateToken, updateProfile);

module.exports = router;
