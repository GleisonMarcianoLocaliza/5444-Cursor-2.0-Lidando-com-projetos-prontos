const { runQuery, getQuery, allQuery } = require('../database');

// GET /car - Listar todos os carros (filtros opcionais: categoryId, search, locationId)
const getAllCars = async (req, res) => {
  try {
    const { categoryId, search, locationId } = req.query;
    const hasLocation = locationId !== undefined && locationId !== '';

    let sql;
    let params = [];

    if (hasLocation) {
      const lid = parseInt(locationId, 10);
      if (isNaN(lid) || lid <= 0) {
        return res.status(400).json({ error: 'locationId deve ser um número positivo' });
      }
      sql =
        'SELECT DISTINCT cars.* FROM cars ' +
        'INNER JOIN car_locations cl ON cl.carId = cars.id ' +
        'WHERE cl.locationId = ?';
      params = [lid];

      if (categoryId) {
        sql += ' AND cars.categoryId = ?';
        params.push(categoryId);
      }
      if (search) {
        sql += ' AND (cars.title LIKE ? OR cars.shortTitle LIKE ? OR cars.description LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }
      sql += ' ORDER BY cars.id';
    } else {
      sql = 'SELECT * FROM cars';
      const conditions = [];
      if (categoryId) {
        conditions.push('categoryId = ?');
        params.push(categoryId);
      }
      if (search) {
        conditions.push('(title LIKE ? OR shortTitle LIKE ? OR description LIKE ?)');
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }
      if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
      }
      sql += ' ORDER BY id';
    }

    const cars = await allQuery(sql, params);
    
    // Parsear JSON fields
    const parsedCars = cars.map(car => ({
      ...car,
      specs: JSON.parse(car.specs),
      features: JSON.parse(car.features)
    }));
    
    res.json(parsedCars);
  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

/**
 * Entre os últimos favoritos, escolhe a categoria mais frequente.
 * Em empate, usa a categoria do favorito mais recente entre as empatadas.
 */
function pickDominantCategoryFromFavorites(rows) {
  const counts = {};
  for (const row of rows) {
    const cid = row.categoryId;
    counts[cid] = (counts[cid] || 0) + 1;
  }
  const max = Math.max(...Object.values(counts));
  const tied = Object.entries(counts)
    .filter(([, c]) => c === max)
    .map(([id]) => Number(id));
  if (tied.length === 1) {
    return tied[0];
  }
  for (const row of rows) {
    if (tied.includes(row.categoryId)) {
      return row.categoryId;
    }
  }
  return tied[0];
}

const parseCarsJson = (cars) =>
  cars.map((car) => ({
    ...car,
    specs: JSON.parse(car.specs),
    features: JSON.parse(car.features)
  }));

// GET /car/recommended - Até 6 carros sugeridos pela categoria dos últimos favoritos (autenticado)
const getRecommendedCars = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit, 10);
    const limitNumber = Number.isNaN(limit) || limit <= 0 ? 6 : Math.min(limit, 50);

    const recentFavorites = await allQuery(
      `
      SELECT c.categoryId
      FROM favorites f
      INNER JOIN cars c ON c.id = f.carId
      WHERE f.userId = ?
      ORDER BY f.createdAt DESC
      LIMIT 6
    `,
      [userId]
    );

    if (recentFavorites.length === 0) {
      const cars = await allQuery('SELECT * FROM cars ORDER BY RANDOM() LIMIT ?', [
        limitNumber
      ]);
      return res.json(parseCarsJson(cars));
    }

    const categoryId = pickDominantCategoryFromFavorites(recentFavorites);
    const cars = await allQuery(
      'SELECT * FROM cars WHERE categoryId = ? ORDER BY RANDOM() LIMIT ?',
      [categoryId, limitNumber]
    );

    res.json(parseCarsJson(cars));
  } catch (error) {
    console.error('Erro ao buscar veículos recomendados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET /car/random - Buscar 6 carros aleatórios
const getRandomCars = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const limitNumber = parseInt(limit);
    
    if (isNaN(limitNumber) || limitNumber <= 0) {
      return res.status(400).json({ error: 'Limit deve ser um número positivo' });
    }
    
    const sql = 'SELECT * FROM cars ORDER BY RANDOM() LIMIT ?';
    const cars = await allQuery(sql, [limitNumber]);

    res.json(parseCarsJson(cars));
  } catch (error) {
    console.error('Erro ao buscar veículos aleatórios:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET /car/:id - Buscar carro por ID
const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await getQuery('SELECT * FROM cars WHERE id = ?', [id]);
    
    if (!car) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }
    
    // Parsear JSON fields
    const parsedCar = {
      ...car,
      specs: JSON.parse(car.specs),
      features: JSON.parse(car.features)
    };
    
    res.json(parsedCar);
  } catch (error) {
    console.error('Erro ao buscar veículo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// POST /car - Criar novo carro
const createCar = async (req, res) => {
  try {
    console.log('Body recebido:', JSON.stringify(req.body, null, 2));
    const { title, shortTitle, description, categoryId, price, image, specs, features } = req.body;
    
    // Validação
    if (!title || !shortTitle || !description || !categoryId || !price || !image) {
      return res.status(400).json({ 
        error: 'Todos os campos obrigatórios devem ser preenchidos' 
      });
    }
    
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'Preço deve ser um número positivo' });
    }
    
    if (typeof categoryId !== 'number') {
      return res.status(400).json({ error: 'ID da categoria deve ser um número' });
    }
    
    // Verificar se a categoria existe
    const category = await getQuery('SELECT id FROM categories WHERE id = ?', [categoryId]);
    if (!category) {
      return res.status(400).json({ error: 'Categoria não encontrada' });
    }
    
    const result = await runQuery(
      `INSERT INTO cars (title, shortTitle, description, categoryId, price, image, specs, features) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        shortTitle,
        description,
        categoryId,
        price,
        image,
        JSON.stringify(specs || {}),
        JSON.stringify(features || [])
      ]
    );
    
    const newCar = await getQuery('SELECT * FROM cars WHERE id = ?', [result.id]);
    const parsedCar = {
      ...newCar,
      specs: JSON.parse(newCar.specs),
      features: JSON.parse(newCar.features)
    };
    
    res.status(201).json(parsedCar);
  } catch (error) {
    console.error('Erro ao criar veículo:', error);
    res.status(500).json({ error: 'Erro interno do servidor error: ' + error.message });
  }
};

// PUT /car/:id - Atualizar carro
const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, shortTitle, description, categoryId, price, image, specs, features } = req.body;
    
    // Verificar se o carro existe
    const existingCar = await getQuery('SELECT * FROM cars WHERE id = ?', [id]);
    if (!existingCar) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }
    
    // Validação
    if (!title || !shortTitle || !description || !categoryId || !price || !image) {
      return res.status(400).json({ 
        error: 'Todos os campos obrigatórios devem ser preenchidos' 
      });
    }
    
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ error: 'Preço deve ser um número positivo' });
    }
    
    if (typeof categoryId !== 'number') {
      return res.status(400).json({ error: 'ID da categoria deve ser um número' });
    }
    
    // Verificar se a categoria existe
    const category = await getQuery('SELECT id FROM categories WHERE id = ?', [categoryId]);
    if (!category) {
      return res.status(400).json({ error: 'Categoria não encontrada' });
    }
    
    await runQuery(
      `UPDATE cars SET title = ?, shortTitle = ?, description = ?, categoryId = ?, 
       price = ?, image = ?, specs = ?, features = ? WHERE id = ?`,
      [
        title,
        shortTitle,
        description,
        categoryId,
        price,
        image,
        JSON.stringify(specs || {}),
        JSON.stringify(features || []),
        id
      ]
    );
    
    const updatedCar = await getQuery('SELECT * FROM cars WHERE id = ?', [id]);
    const parsedCar = {
      ...updatedCar,
      specs: JSON.parse(updatedCar.specs),
      features: JSON.parse(updatedCar.features)
    };
    
    res.json(parsedCar);
  } catch (error) {
    console.error('Erro ao atualizar veículo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// DELETE /car/:id - Deletar carro
const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o carro existe
    const existingCar = await getQuery('SELECT * FROM cars WHERE id = ?', [id]);
    if (!existingCar) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }
    
    await runQuery('DELETE FROM cars WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar veículo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getAllCars,
  getRecommendedCars,
  getRandomCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
};
