const { runQuery, getQuery, allQuery } = require('../database');

// GET /favorites - Listar favoritos do usuário
const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await allQuery(`
      SELECT f.id, f.carId, f.createdAt, c.title, c.shortTitle, c.price, c.image
      FROM favorites f
      JOIN cars c ON f.carId = c.id
      WHERE f.userId = ?
      ORDER BY f.createdAt DESC
    `, [userId]);

    res.json(favorites);
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// POST /favorites/:carId - Adicionar favorito
const addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { carId } = req.params;

    // Verificar se o carro existe
    const car = await getQuery('SELECT id FROM cars WHERE id = ?', [carId]);
    if (!car) {
      return res.status(404).json({ error: 'Carro não encontrado' });
    }

    // Verificar se já é favorito
    const existingFavorite = await getQuery(
      'SELECT id FROM favorites WHERE userId = ? AND carId = ?',
      [userId, carId]
    );

    if (existingFavorite) {
      return res.status(400).json({ error: 'Carro já está nos favoritos' });
    }

    // Adicionar favorito
    await runQuery(
      'INSERT INTO favorites (userId, carId) VALUES (?, ?)',
      [userId, carId]
    );

    res.status(201).json({ message: 'Carro adicionado aos favoritos' });
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// DELETE /favorites/:carId - Remover favorito
const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { carId } = req.params;

    // Verificar se o favorito existe
    const favorite = await getQuery(
      'SELECT id FROM favorites WHERE userId = ? AND carId = ?',
      [userId, carId]
    );

    if (!favorite) {
      return res.status(404).json({ error: 'Favorito não encontrado' });
    }

    // Remover favorito
    await runQuery(
      'DELETE FROM favorites WHERE userId = ? AND carId = ?',
      [userId, carId]
    );

    res.json({ message: 'Carro removido dos favoritos' });
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET /favorites/:carId - Verificar se carro é favorito
const isFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { carId } = req.params;

    const favorite = await getQuery(
      'SELECT id FROM favorites WHERE userId = ? AND carId = ?',
      [userId, carId]
    );

    res.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error('Erro ao verificar favorito:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite
};
