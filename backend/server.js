
const Fastify = require('fastify');
const cors = require('@fastify/cors');
const Database = require('better-sqlite3');

const app = Fastify({ logger: true });

app.register(cors, { origin: true });

const db = new Database('gamekey.db');

db.pragma('foreign_keys = ON');

// Criação das tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS jogos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL,
    plataforma TEXT NOT NULL,
    categoria TEXT NOT NULL,
    descricao TEXT,
    status TEXT NOT NULL DEFAULT 'ativo'
  );

  CREATE TABLE IF NOT EXISTS chaveiros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL UNIQUE,
    jogo_codigo TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ativo',
    criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jogo_codigo) REFERENCES jogos(codigo)
  );
`);

// Atualiza o banco existente sem apagar os dados
const colunas = db.prepare('PRAGMA table_info(jogos)').all();
const nomes = colunas.map(c => c.name);

if (!nomes.includes('emulador')) {
  db.exec('ALTER TABLE jogos ADD COLUMN emulador TEXT');
}

if (!nomes.includes('rom_url')) {
  db.exec('ALTER TABLE jogos ADD COLUMN rom_url TEXT');
}

// Catálogo dos 29 jogos
const jogosIniciais = [
  ['GK-SNES-001', 'Super Mario World', 'Super Nintendo', 'Aventura', 'Explore o mundo de Mario.'],
  ['GK-SNES-002', "Yoshi's Island", 'Super Nintendo', 'Aventura', 'Acompanhe Yoshi em sua aventura.'],
  ['GK-SNES-003', 'Mario Kart', 'Super Nintendo', 'Corrida', 'Dispute corridas com personagens clássicos.'],
  ['GK-SNES-004', 'Donkey Kong 1', 'Super Nintendo', 'Aventura', 'Explore a selva com Donkey Kong.'],
  ['GK-SNES-005', 'Donkey Kong 2', 'Super Nintendo', 'Aventura', 'Uma nova aventura na selva.'],
  ['GK-SNES-006', 'Donkey Kong 3', 'Super Nintendo', 'Aventura', 'Continue a aventura de Donkey Kong.'],
  ['GK-SNES-007', 'Aladdin', 'Super Nintendo', 'Aventura', 'Viva a aventura de Aladdin.'],
  ['GK-SNES-008', 'O Rei Leão', 'Super Nintendo', 'Aventura', 'Aventura inspirada no Rei Leão.'],

  ['GK-MD-001', 'Comix Zone', 'Mega Drive', 'Ação', 'Entre em uma aventura dentro dos quadrinhos.'],
  ['GK-MD-002', 'Streets of Rage 1', 'Mega Drive', 'Ação', 'Enfrente inimigos nas ruas.'],
  ['GK-MD-003', 'Streets of Rage 2', 'Mega Drive', 'Ação', 'Continue a luta pela cidade.'],
  ['GK-MD-004', 'Earthworm Jim 1', 'Mega Drive', 'Ação', 'Uma aventura maluca com Jim.'],
  ['GK-MD-005', 'Earthworm Jim 2', 'Mega Drive', 'Ação', 'Mais desafios com Earthworm Jim.'],
  ['GK-MD-006', 'Sonic 1', 'Mega Drive', 'Plataforma', 'Corra em alta velocidade com Sonic.'],
  ['GK-MD-007', 'Sonic 2', 'Mega Drive', 'Plataforma', 'Sonic está de volta com novos desafios.'],
  ['GK-MD-008', 'Sonic 3', 'Mega Drive', 'Plataforma', 'Explore novas fases com Sonic.'],

  ['GK-PS1-001', 'Resident Evil 1', 'PlayStation 1', 'Terror', 'Enfrente mistérios e perigos.'],
  ['GK-PS1-002', 'Resident Evil 2', 'PlayStation 1', 'Terror', 'Sobreviva a novos desafios.'],
  ['GK-PS1-003', 'Resident Evil 3', 'PlayStation 1', 'Terror', 'Tente sobreviver em uma cidade perigosa.'],
  ['GK-PS1-004', 'Mega Man X2', 'PlayStation 1', 'Ação', 'Enfrente novos inimigos.'],
  ['GK-PS1-005', 'Mega Man X3', 'PlayStation 1', 'Ação', 'Continue a batalha de Mega Man X.'],
  ['GK-PS1-006', 'Mega Man X4', 'PlayStation 1', 'Ação', 'Uma nova aventura de ação.'],
  ['GK-PS1-007', 'Castlevania: Symphony of the Night', 'PlayStation 1', 'Aventura', 'Explore o castelo de Drácula.'],
  ['GK-PS1-008', 'Crash Bandicoot: Warped', 'PlayStation 1', 'Aventura', 'Viaje por diferentes épocas com Crash.'],
  ['GK-PS1-009', 'Street Fighter Alpha 2', 'PlayStation 1', 'Luta', 'Entre em combates clássicos.'],

  ['GK-N64-001', 'Super Mario 64', 'Nintendo 64', 'Aventura', 'Explore mundos em três dimensões.'],
  ['GK-N64-002', 'Mario Kart 64', 'Nintendo 64', 'Corrida', 'Dispute corridas com Mario e seus amigos.'],
  ['GK-N64-003', 'The Legend of Zelda: Ocarina of Time', 'Nintendo 64', 'Aventura', 'Viva uma aventura lendária com Link.'],
  ['GK-N64-004', 'Killer Instinct Gold', 'Nintendo 64', 'Luta', 'Participe de combates intensos.']
];

const inserirJogo = db.prepare(`
  INSERT OR IGNORE INTO jogos
  (codigo, nome, plataforma, categoria, descricao)
  VALUES (?, ?, ?, ?, ?)
`);

const inserirChaveiro = db.prepare(`
  INSERT OR IGNORE INTO chaveiros (codigo, jogo_codigo)
  VALUES (?, ?)
`);

db.transaction(() => {
  for (const jogo of jogosIniciais) {
    inserirJogo.run(...jogo);
    inserirChaveiro.run(jogo[0], jogo[0]);
  }
})();

// Configura emuladores por plataforma
db.exec(`
  UPDATE jogos
  SET emulador = CASE
    WHEN plataforma = 'Super Nintendo' THEN 'snes'
    WHEN plataforma = 'Mega Drive' THEN 'segaMD'
    WHEN plataforma = 'PlayStation 1' THEN 'psx'
    WHEN plataforma = 'Nintendo 64' THEN 'n64'
    ELSE NULL
  END;
`);

// Configura o primeiro jogo já testado
db.prepare(`
  UPDATE jogos
  SET rom_url = ?
  WHERE codigo = ?
`).run('/games/mario.smc', 'GK-SNES-001');

// API inicial
app.get('/', async () => ({
  sistema: 'GameKey',
  status: 'online',
  mensagem: 'API e banco de dados funcionando.'
}));

// Lista jogos
app.get('/api/jogos', async () => {
  return db.prepare(`
    SELECT codigo, nome, plataforma, categoria, descricao,
           emulador, rom_url
    FROM jogos
    WHERE status = 'ativo'
    ORDER BY plataforma, nome
  `).all();
});

// Busca jogo
app.get('/api/jogos/:codigo', async (request, reply) => {
  const codigo = request.params.codigo.toUpperCase();

  const jogo = db.prepare(`
    SELECT codigo, nome, plataforma, categoria, descricao,
           status, emulador, rom_url
    FROM jogos
    WHERE codigo = ?
  `).get(codigo);

  if (!jogo) {
    return reply.code(404).send({ erro: 'Jogo não encontrado.' });
  }

  return jogo;
});

// Valida chaveiro
app.get('/api/chaveiros/:codigo', async (request, reply) => {
  const codigo = request.params.codigo.toUpperCase();

  const resultado = db.prepare(`
    SELECT
      chaveiros.codigo AS codigo_chaveiro,
      chaveiros.status AS status_chaveiro,
      jogos.codigo AS codigo_jogo,
      jogos.nome,
      jogos.plataforma,
      jogos.categoria,
      jogos.descricao,
      jogos.status AS status_jogo,
      jogos.emulador,
      jogos.rom_url
    FROM chaveiros
    INNER JOIN jogos ON jogos.codigo = chaveiros.jogo_codigo
    WHERE chaveiros.codigo = ?
  `).get(codigo);

  if (!resultado) {
    return reply.code(404).send({
      valido: false,
      erro: 'Chaveiro não cadastrado.'
    });
  }

  if (
    resultado.status_chaveiro !== 'ativo' ||
    resultado.status_jogo !== 'ativo'
  ) {
    return reply.code(403).send({
      valido: false,
      erro: 'Este chaveiro ou jogo está desativado.'
    });
  }

  return {
    valido: true,
    chaveiro: resultado.codigo_chaveiro,
    jogo: {
      codigo: resultado.codigo_jogo,
      nome: resultado.nome,
      plataforma: resultado.plataforma,
      categoria: resultado.categoria,
      descricao: resultado.descricao,
      emulador: resultado.emulador,
      rom_url: resultado.rom_url
    }
  };
});

// Inicia servidor
const iniciarServidor = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('GameKey API disponível na porta 3000.');
  } catch (erro) {
    app.log.error(erro);
    process.exit(1);
  }
};

iniciarServidor();
