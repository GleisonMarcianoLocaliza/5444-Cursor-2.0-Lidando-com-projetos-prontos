const jwt = require('jsonwebtoken');
const { getQuery } = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'loucadora-locadora-secret-key-2024';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso necessário' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Buscar usuário no banco para garantir que ainda existe
    const user = await getQuery('SELECT id, name, email FROM users WHERE id = ?', [decoded.userId]);
    
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    return res.status(403).json({ error: 'Token inválido' });
  }
};

module.exports = { authenticateToken, JWT_SECRET };
