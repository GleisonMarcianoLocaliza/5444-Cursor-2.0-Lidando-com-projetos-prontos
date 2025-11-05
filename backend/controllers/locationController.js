const { allQuery } = require('../database');

// Buscar todos os locais
const getAllLocations = async (req, res) => {
  try {
    const locations = await allQuery('SELECT * FROM locations ORDER BY city, name');
    res.json(locations);
  } catch (error) {
    console.error('Erro ao buscar locais:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Buscar local por ID
const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await allQuery('SELECT * FROM locations WHERE id = ?', [id]);
    
    if (location.length === 0) {
      return res.status(404).json({ error: 'Local não encontrado' });
    }
    
    res.json(location[0]);
  } catch (error) {
    console.error('Erro ao buscar local:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getAllLocations,
  getLocationById
};
