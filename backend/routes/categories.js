const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// GET /category - Listar todas as categorias
router.get('/', getAllCategories);

// GET /category/:id - Buscar categoria por ID
router.get('/:id', getCategoryById);

// POST /category - Criar nova categoria
router.post('/', createCategory);

// PUT /category/:id - Atualizar categoria
router.put('/:id', updateCategory);

// DELETE /category/:id - Deletar categoria
router.delete('/:id', deleteCategory);

module.exports = router;
