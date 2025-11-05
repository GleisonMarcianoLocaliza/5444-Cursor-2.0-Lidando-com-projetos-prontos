const fs = require('fs');
const path = require('path');
const { initDatabase, runQuery, closeDatabase } = require('./database');

// Ler dados do server.json
const serverDataPath = path.join(__dirname, 'database', 'server.json');
const serverData = JSON.parse(fs.readFileSync(serverDataPath, 'utf8'));

const seedDatabase = async (shouldCloseDatabase = true) => {
  try {
    console.log('Iniciando seed do banco de dados...');
    
    // Inicializar banco de dados
    if (shouldCloseDatabase) {
      await initDatabase();
    }
    
    // Limpar dados existentes
    await runQuery('DELETE FROM cars');
    await runQuery('DELETE FROM categories');
    
    // Inserir categorias
    console.log('Inserindo categorias...');
    for (const category of serverData.category) {
      await runQuery(
        'INSERT INTO categories (id, title, description) VALUES (?, ?, ?)',
        [category.id, category.title, category.description]
      );
    }
    
    // Inserir carros
    console.log('Inserindo carros...');
    for (const car of serverData.car) {
      await runQuery(
        `INSERT INTO cars (id, title, shortTitle, description, categoryId, price, image, specs, features) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          car.id,
          car.title,
          car.shortTitle,
          car.description,
          car.categoryId,
          car.price,
          car.image,
          JSON.stringify(car.specs),
          JSON.stringify(car.features)
        ]
      );
    }
    
    console.log('Seed concluído com sucesso!');
    console.log(`- ${serverData.category.length} categorias inseridas`);
    console.log(`- ${serverData.car.length} carros inseridos`);
    
  } catch (error) {
    console.error('Erro durante o seed:', error);
  } finally {
    if (shouldCloseDatabase) {
      await closeDatabase();
    }
  }
};

// Executar seed se o arquivo for chamado diretamente
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
