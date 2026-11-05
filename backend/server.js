
require('dotenv').config();

const Fastify = require('fastify');
const cors = require('@fastify/cors');
const { Pool } = require('pg');

const app = Fastify({ logger: true });

const PORT = Number(process.env.PORT) || 3000;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não configurada no arquivo .env');
}

// Conexão com PostgreSQL do Supabase
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

app.register(cors, { origin: true });

// Encerrar conexão com banco ao fechar servidor
app.addHook('onClose', async () => {
  await db.end();
});

// ==========================================
// ROTA PRINCIPAL
// ==========================================

app.get('/', async () => {
  return {
    sistema: 'GameKey',
    status: 'online',
    banco: 'Supabase PostgreSQL',
    mensagem: 'API e banco de dados funcionando.'
  };
});

// ==========================================
// LISTAR JOGOS
// ==========================================

app.get('/api/jogos', async () => {
  const resultado = await db.query(`
    SELECT codigo, nome, plataforma, categoria,
           descricao, emulador, rom_url
    FROM jogos
    WHERE status = 'ativo'
    ORDER BY plataforma, nome
  `);

  return resultado.rows;
});

// ==========================================
// BUSCAR JOGO
// ==========================================

app.get('/api/jogos/:codigo', async (request, reply) => {
  const codigo = request.params.codigo.toUpperCase();

  const resultado = await db.query(`
    SELECT codigo, nome, plataforma, categoria,
           descricao, status, emulador, rom_url
    FROM jogos
    WHERE codigo = $1
  `, [codigo]);

  if (resultado.rows.length === 0) {
    return reply.code(404).send({
      erro: 'Jogo não encontrado.'
    });
  }

  return resultado.rows[0];
});

// ==========================================
// VALIDAR CHAVEIRO NFC
// ==========================================

app.get('/api/chaveiros/:codigo', async (request, reply) => {
  const codigo = request.params.codigo.toUpperCase();

  const resultado = await db.query(`
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
    INNER JOIN jogos
      ON jogos.codigo = chaveiros.jogo_codigo
    WHERE chaveiros.codigo = $1
  `, [codigo]);

  if (resultado.rows.length === 0) {
    return reply.code(404).send({
      valido: false,
      erro: 'Chaveiro não cadastrado.'
    });
  }

  const item = resultado.rows[0];

  if (
    item.status_chaveiro !== 'ativo' ||
    item.status_jogo !== 'ativo'
  ) {
    return reply.code(403).send({
      valido: false,
      erro: 'Este chaveiro ou jogo está desativado.'
    });
  }

  return {
    valido: true,
    chaveiro: item.codigo_chaveiro,
    jogo: {
      codigo: item.codigo_jogo,
      nome: item.nome,
      plataforma: item.plataforma,
      categoria: item.categoria,
      descricao: item.descricao,
      emulador: item.emulador,
      rom_url: item.rom_url
    }
  };
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

async function iniciarServidor() {
  try {
    // Testar conexão com Supabase
    await db.query('SELECT 1');

    console.log('Conexão com Supabase realizada!');

    await app.listen({
      port: PORT,
      host: '0.0.0.0'
    });

    console.log(`GameKey API disponível na porta ${PORT}.`);

  } catch (erro) {
    app.log.error(erro);
    process.exit(1);
  }
}

iniciarServidor();
