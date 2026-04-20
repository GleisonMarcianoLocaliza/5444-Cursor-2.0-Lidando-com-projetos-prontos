const { runQuery, allQuery, getQuery, closeDatabase } = require('./database');

/**
 * Frota padrão: cada carro em todas as unidades.
 * Exceção: Batmóvel disponível apenas na unidade do Rio de Janeiro.
 */
const seedCarLocations = async (shouldCloseDatabase = true) => {
  try {
    await runQuery('DELETE FROM car_locations');

    const cars = await allQuery('SELECT id, shortTitle FROM cars');
    const locations = await allQuery('SELECT id FROM locations');

    if (cars.length === 0 || locations.length === 0) {
      console.warn('seedCarLocations: sem carros ou sem locais; nada a associar.');
      return;
    }

    const rio = await getQuery(
      "SELECT id FROM locations WHERE city = 'Rio de Janeiro' LIMIT 1"
    );

    let linkCount = 0;

    for (const car of cars) {
      const isBatmovel = car.shortTitle === 'Batmóvel';

      if (isBatmovel) {
        if (!rio) {
          console.warn('seedCarLocations: Rio de Janeiro não encontrado; Batmóvel sem vínculo.');
          continue;
        }
        await runQuery(
          'INSERT INTO car_locations (carId, locationId) VALUES (?, ?)',
          [car.id, rio.id]
        );
        linkCount += 1;
        continue;
      }

      for (const loc of locations) {
        await runQuery(
          'INSERT INTO car_locations (carId, locationId) VALUES (?, ?)',
          [car.id, loc.id]
        );
        linkCount += 1;
      }
    }

    console.log(`Car_locations: ${linkCount} vínculos (Batmóvel só no Rio).`);
  } catch (error) {
    console.error('Erro ao popular car_locations:', error);
    throw error;
  } finally {
    if (shouldCloseDatabase) {
      await closeDatabase();
    }
  }
};

if (require.main === module) {
  seedCarLocations();
}

module.exports = { seedCarLocations };
