const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { runQuery, getQuery } = require('../database');
const { JWT_SECRET } = require('../middleware/auth');

// POST /auth/register - Registrar usuário
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validação
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
    }

    // Verificar se email já existe
    const existingUser = await getQuery('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar usuário
    const result = await runQuery(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Gerar token JWT
    const token = jwt.sign(
      { userId: result.id, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      user: {
        id: result.id,
        name,
        email
      }
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// POST /auth/login - Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const user = await getQuery('SELECT id, name, email, password FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET /auth/me - Obter dados do usuário atual
const getCurrentUser = async (req, res) => {
  try {
    // O usuário já está disponível através do middleware de autenticação
    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
      }
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// POST /auth/validate-password - Validar senha atual
const validatePassword = async (req, res) => {
  try {
    const { currentPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword) {
      return res.status(400).json({ error: 'Senha atual é obrigatória' });
    }

    // Buscar usuário
    const user = await getQuery('SELECT password FROM users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }
    
    res.json({ isValid: true });
  } catch (error) {
    console.error('Erro ao validar senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// PUT /auth/update-profile - Atualizar perfil do usuário
const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validações básicas
    if (!name || !email) {
      return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    }

    // Se está alterando a senha, validar senha atual
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Senha atual é obrigatória para alterar a senha' });
      }

      // Verificar senha atual
      const user = await getQuery('SELECT password FROM users WHERE id = ?', [userId]);
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Senha atual incorreta' });
      }
    }

    // Verificar se email já existe em outro usuário
    const existingUser = await getQuery('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email já está em uso por outro usuário' });
    }

    // Preparar dados para atualização
    let updateQuery = 'UPDATE users SET name = ?, email = ?';
    let updateParams = [name, email];

    // Se está alterando a senha, incluir hash da nova senha
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateQuery += ', password = ?';
      updateParams.push(hashedPassword);
    }

    updateQuery += ' WHERE id = ?';
    updateParams.push(userId);

    // Executar atualização
    await runQuery(updateQuery, updateParams);

    // Buscar usuário atualizado
    const updatedUser = await getQuery('SELECT id, name, email FROM users WHERE id = ?', [userId]);

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: updatedUser
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  validatePassword,
  updateProfile
};
