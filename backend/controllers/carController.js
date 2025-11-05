const { runQuery, getQuery, allQuery } = require('../database');

// GET /car - Listar todos os carros (com filtro opcional por categoria e busca)
const getAllCars = async (req, res) => {
  try {
    const { categoryId, search } = req.query;
    let sql = 'SELECT * FROM cars';
    let params = [];
    let conditions = [];
    
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
    
    const cars = await allQuery(sql, params);
    
    // Parsear JSON fields
    const parsedCars = cars.map(car => ({
      ...car,
      specs: JSON.parse(car.specs),
      features: JSON.parse(car.features)
    }));
    
    res.json(parsedCars);
  } catch (error) {
    console.error('Erro ao buscar carros:', error);
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
    
    // Parsear JSON fields
    const parsedCars = cars.map(car => ({
      ...car,
      specs: JSON.parse(car.specs),
      features: JSON.parse(car.features)
    }));
    
    res.json(parsedCars);
  } catch (error) {
    console.error('Erro ao buscar carros aleatórios:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET /car/:id - Buscar carro por ID
const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await getQuery('SELECT * FROM cars WHERE id = ?', [id]);
    
    if (!car) {
      return res.status(404).json({ error: 'Carro não encontrado' });
    }
    
    // Parsear JSON fields
    const parsedCar = {
      ...car,
      specs: JSON.parse(car.specs),
      features: JSON.parse(car.features)
    };
    
    res.json(parsedCar);
  } catch (error) {
    console.error('Erro ao buscar carro:', error);
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
    console.error('Erro ao criar carro:', error);
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
      return res.status(404).json({ error: 'Carro não encontrado' });
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
    console.error('Erro ao atualizar carro:', error);
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
      return res.status(404).json({ error: 'Carro não encontrado' });
    }
    
    await runQuery('DELETE FROM cars WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar carro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getAllCars,
  getRandomCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar
};
