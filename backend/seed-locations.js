const { initDatabase, runQuery, allQuery, closeDatabase } = require('./database');

const locations = [
  {
    name: 'Unidade São Paulo – Avenida Paulista',
    address: 'Av. Paulista, 1578 – Bela Vista, São Paulo/SP',
    description: 'Aqui o trânsito é só um detalhe no multiverso.',
    emoji: '🕶️',
    city: 'São Paulo',
    state: 'SP'
  },
  {
    name: 'Matrix Brasília – Setor Hoteleiro Norte',
    address: 'SHN Quadra 2, Bloco D – Brasília/DF',
    description: 'Escolha o carro vermelho e descubra quão fundo vai o buraco da garagem.',
    emoji: '💾',
    city: 'Brasília',
    state: 'DF'
  },
  {
    name: 'Unidade Rio de Janeiro – Copacabana Drive',
    address: 'Av. Atlântica, 3200 – Copacabana, Rio de Janeiro/RJ',
    description: 'A vista é real, o resto é ficção cinematográfica.',
    emoji: '🌴',
    city: 'Rio de Janeiro',
    state: 'RJ'
  },
  {
    name: 'Racha Fortaleza – Beira Mar',
    address: 'Av. Beira Mar, 2450 – Fortaleza/CE',
    description: 'Modo turbo: ativado.',
    emoji: '🔥',
    city: 'Fortaleza',
    state: 'CE'
  },
  {
    name: 'Frost Drive – Curitiba Center',
    address: 'Rua Bispo Dom José, 255 – Batel, Curitiba/PR',
    description: 'A cidade é fria, mas o ronco do motor aquece o coração.',
    emoji: '❄️️',
    city: 'Curitiba',
    state: 'PR'
  },
  {
    name: 'DeLorean BH – Savassi Station',
    address: 'Av. Getúlio Vargas, 890 – Savassi, Belo Horizonte/MG',
    description: 'Aqui você aluga tempo e velocidade.',
    emoji: '⏱️',
    city: 'Belo Horizonte',
    state: 'MG'
  },
  {
    name: 'Loucadora Acre – Rua Epaminondas Jácome',
    address: 'Centro, Rio Branco/AC',
    description: 'Porque até no fim do mapa, a viagem é insana.',
    emoji: '🌅',
    city: 'Rio Branco',
    state: 'AC'
  },
  {
    name: 'Toretto Guarulhos – Aeroporto Internacional',
    address: 'Rod. Hélio Smidt, s/n – Cumbica, Guarulhos/SP',
    description: 'Família, motor e velocidade: o tripé sagrado.',
    emoji: '🏁',
    city: 'Guarulhos',
    state: 'SP'
  },
  {
    name: 'Gotham Porto Alegre – Moinhos de Vento',
    address: 'Rua Padre Chagas, 420 – Porto Alegre/RS',
    description: 'Alugue um carro. Vá salvar a noite.',
    emoji: '🦇',
    city: 'Porto Alegre',
    state: 'RS'
  },
  {
    name: 'Loucadora Manaus – Ponta Negra',
    address: 'Av. Coronel Teixeira, 3500 – Manaus/AM',
    description: 'Onde a selva encontra o asfalto.',
    emoji: '🌴',
    city: 'Manaus',
    state: 'AM'
  }
];

const seedLocations = async (shouldCloseDatabase = true) => {
  try {
    // Sempre inicializar o banco para garantir que as tabelas existam
    console.log('Inicializando banco de dados...');
    await initDatabase();
    
    console.log('Inserindo locais...');
    for (const location of locations) {
      // Verificar se o local já existe
      const existingLocation = await allQuery(
        'SELECT id FROM locations WHERE name = ? AND address = ?',
        [location.name, location.address]
      );
      
      // Só inserir se não existir
      if (existingLocation.length === 0) {
        await runQuery(
          `INSERT INTO locations (name, address, description, emoji, city, state) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [location.name, location.address, location.description, location.emoji, location.city, location.state]
        );
      }
    }
    
    console.log('Locais inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir locais:', error);
  } finally {
    if (shouldCloseDatabase) {
      await closeDatabase();
    }
  }
};

// Executar seed se o arquivo for chamado diretamente
if (require.main === module) {
  seedLocations();
}

module.exports = { seedLocations };
