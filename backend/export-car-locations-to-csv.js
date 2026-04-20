/**
 * Uso: node export-car-locations-to-csv.js
 * Gera car_locations_para_excel.csv na pasta backend (abra no Excel).
 */
const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'locadora.db');
const outPath = path.join(__dirname, 'car_locations_para_excel.csv');

const sql = `
  SELECT
    cl.carId AS car_id,
    c.shortTitle AS carro,
    cl.locationId AS location_id,
    l.city AS cidade,
    l.name AS unidade
  FROM car_locations cl
  INNER JOIN cars c ON c.id = cl.carId
  INNER JOIN locations l ON l.id = cl.locationId
  ORDER BY cl.carId, cl.locationId
`;

const db = new sqlite3.Database(dbPath);

db.all(sql, [], (err, rows) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  const headers = ['car_id', 'carro', 'location_id', 'cidade', 'unidade'];
  const esc = (v) => {
    if (v == null) return '';
    const s = String(v);
    if (/[;"\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const lines = [headers.join(';')];
  for (const row of rows) {
    lines.push(headers.map((h) => esc(row[h])).join(';'));
  }

  fs.writeFileSync(outPath, '\uFEFF' + lines.join('\r\n'), 'utf8');
  console.log(`Arquivo gerado: ${outPath}`);
  console.log(`Linhas de dados: ${rows.length}`);
  db.close();
});
