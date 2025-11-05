const { runQuery, getQuery, allQuery } = require('../database');

// GET /category - Listar todas as categorias
const getAllCategories = async (req, res) => {
  try {
    const categories = await allQuery('SELECT * FROM categories ORDER BY id');
    res.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET /category/:id - Buscar categoria por ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await getQuery('SELECT * FROM categories WHERE id = ?', [id]);
    
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// POST /category - Criar nova categoria
const createCategory = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // Validação
    if (!title || !description) {
      return res.status(400).json({ error: 'Título e descrição são obrigatórios' });
    }
    
    const result = await runQuery(
      'INSERT INTO categories (title, description) VALUES (?, ?)',
      [title, description]
    );
    
    const newCategory = await getQuery('SELECT * FROM categories WHERE id = ?', [result.id]);
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// PUT /category/:id - Atualizar categoria
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    // Validação
    if (!title || !description) {
      return res.status(400).json({ error: 'Título e descrição são obrigatórios' });
    }
    
    // Verificar se a categoria existe
    const existingCategory = await getQuery('SELECT * FROM categories WHERE id = ?', [id]);
    if (!existingCategory) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    
    await runQuery(
      'UPDATE categories SET title = ?, description = ? WHERE id = ?',
      [title, description, id]
    );
    
    const updatedCategory = await getQuery('SELECT * FROM categories WHERE id = ?', [id]);
    res.json(updatedCategory);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// DELETE /category/:id - Deletar categoria
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se a categoria existe
    const existingCategory = await getQuery('SELECT * FROM categories WHERE id = ?', [id]);
    if (!existingCategory) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    
    // Verificar se há carros associados à categoria
    const carsInCategory = await allQuery('SELECT id FROM cars WHERE categoryId = ?', [id]);
    if (carsInCategory.length > 0) {
      return res.status(400).json({ 
        error: 'Não é possível deletar categoria que possui carros associados' 
      });
    }
    
    await runQuery('DELETE FROM categories WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
