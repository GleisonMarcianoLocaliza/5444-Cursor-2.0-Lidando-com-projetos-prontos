const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { initDatabase } = require('./database');
const { seedDatabase } = require('./seed');
const { seedLocations } = require('./seed-locations');

// Importar rotas
const categoriesRoutes = require('./routes/categories');
const carsRoutes = require('./routes/cars');
const authRoutes = require('./routes/auth');
const favoritesRoutes = require('./routes/favorites');
const locationsRoutes = require('./routes/locations');
const reservationsRoutes = require('./routes/reservations');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Permitir requisições do frontend React
app.use(morgan('combined')); // Logger de requisições
app.use(express.json()); // Parser para JSON
app.use(express.urlencoded({ extended: true })); // Parser para URL-encoded

// Servir arquivos estáticos (imagens dos carros)
app.use('/car-models', express.static(path.join(__dirname, 'database', 'car-models')));

// Rotas da API
app.use('/category', categoriesRoutes);
app.use('/car', carsRoutes);
app.use('/auth', authRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/locations', locationsRoutes);
app.use('/reservations', reservationsRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando corretamente' });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicializar servidor
const startServer = async () => {
  try {
    // Inicializar banco de dados
    await initDatabase();
    
    // Executar seeds
    console.log('🌱 Executando seeds do banco de dados...');
    await seedDatabase(false); // Não fechar conexão pois o servidor ainda vai usar
    await seedLocations(false); // Não fechar conexão pois o servidor ainda vai usar
    console.log('✅ Seeds executados com sucesso!');
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🚗 API de carros: http://localhost:${PORT}/car`);
      console.log(`📂 API de categorias: http://localhost:${PORT}/category`);
      console.log(`🖼️  Imagens: http://localhost:${PORT}/car-models/`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor se o arquivo for executado diretamente
if (require.main === module) {
  startServer();
}

module.exports = app;
