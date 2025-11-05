const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o banco de dados
const dbPath = path.join(__dirname, 'locadora.db');

// Criar conexão com o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }
});

// Inicializar o banco de dados com as tabelas
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Criar tabela categories
      db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL
        )
      `, (err) => {
        if (err) {
          console.error('Erro ao criar tabela categories:', err.message);
          reject(err);
        }
      });

      // Criar tabela cars
      db.run(`
        CREATE TABLE IF NOT EXISTS cars (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          shortTitle TEXT NOT NULL,
          description TEXT NOT NULL,
          categoryId INTEGER NOT NULL,
          price REAL NOT NULL,
          image TEXT NOT NULL,
          specs TEXT NOT NULL,
          features TEXT NOT NULL,
          FOREIGN KEY (categoryId) REFERENCES categories (id)
        )
      `, (err) => {
        if (err) {
          console.error('Erro ao criar tabela cars:', err.message);
          reject(err);
        }
      });

      // Criar tabela users
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Erro ao criar tabela users:', err.message);
          reject(err);
        }
      });

      // Criar tabela favorites
      db.run(`
        CREATE TABLE IF NOT EXISTS favorites (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          carId INTEGER NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (carId) REFERENCES cars (id) ON DELETE CASCADE,
          UNIQUE(userId, carId)
        )
      `, (err) => {
        if (err) {
          console.error('Erro ao criar tabela favorites:', err.message);
          reject(err);
        }
      });

      // Criar tabela locations
      db.run(`
        CREATE TABLE IF NOT EXISTS locations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          address TEXT NOT NULL,
          description TEXT NOT NULL,
          emoji TEXT NOT NULL,
          city TEXT NOT NULL,
          state TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          console.error('Erro ao criar tabela locations:', err.message);
          reject(err);
        }
      });

      // Criar tabela reservations
      db.run(`
        CREATE TABLE IF NOT EXISTS reservations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          carId INTEGER NOT NULL,
          pickupLocation TEXT NOT NULL,
          pickupDate TEXT NOT NULL,
          pickupTime TEXT NOT NULL,
          returnLocation TEXT NOT NULL,
          returnDate TEXT NOT NULL,
          returnTime TEXT NOT NULL,
          protectionPlanId TEXT NOT NULL,
          protectionPlanName TEXT NOT NULL,
          protectionPlanPrice REAL NOT NULL,
          paymentMethod TEXT NOT NULL,
          totalValue REAL NOT NULL,
          status TEXT NOT NULL DEFAULT 'confirmed',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (carId) REFERENCES cars (id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          console.error('Erro ao criar tabela reservations:', err.message);
          reject(err);
        } else {
          console.log('Tabelas criadas com sucesso.');
          resolve();
        }
      });
    });
  });
};

// Função para executar queries
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

// Função para buscar dados
const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

// Função para buscar múltiplos dados
const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Fechar conexão com o banco
const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Conexão com o banco de dados fechada.');
        resolve();
      }
    });
  });
};

module.exports = {
  db,
  initDatabase,
  runQuery,
  getQuery,
  allQuery,
  closeDatabase
};
