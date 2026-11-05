
require('dotenv').config();

const Database = require('better-sqlite3');
const { Client } = require('pg');
const path = require('path');

// Banco SQLite original do GameKey
const db = new Database(
  path.join(__dirname, 'gamekey.db'),
  { readonly: true, fileMustExist: true }
);

// Conexão com Supabase
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrar() {
  try {
    // Ler os dados locais
    const jogos = db.prepare(`
      SELECT codigo, nome, plataforma, categoria,
             descricao, status, emulador, rom_url
      FROM jogos
    `).all();

    const chaveiros = db.prepare(`
      SELECT codigo, jogo_codigo, status, criado_em
      FROM chaveiros
    `).all();

    console.log(`Jogos encontrados: ${jogos.length}`);
    console.log(`Chaveiros encontrados: ${chaveiros.length}`);

    await client.connect();
    await client.query('BEGIN');

    // Migrar jogos primeiro
    for (const jogo of jogos) {
      await client.query(`
        INSERT INTO jogos (
          codigo, nome, plataforma, categoria,
          descricao, status, emulador, rom_url
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (codigo) DO UPDATE SET
          nome = EXCLUDED.nome,
          plataforma = EXCLUDED.plataforma,
          categoria = EXCLUDED.categoria,
          descricao = EXCLUDED.descricao,
          status = EXCLUDED.status,
          emulador = EXCLUDED.emulador,
          rom_url = EXCLUDED.rom_url
      `, [
        jogo.codigo,
        jogo.nome,
        jogo.plataforma,
        jogo.categoria,
        jogo.descricao,
        jogo.status,
        jogo.emulador,
        jogo.rom_url
      ]);
    }

    // Migrar chaveiros depois dos jogos
    for (const chaveiro of chaveiros) {
      await client.query(`
        INSERT INTO chaveiros (
          codigo, jogo_codigo, status, criado_em
        )
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (codigo) DO UPDATE SET
          jogo_codigo = EXCLUDED.jogo_codigo,
          status = EXCLUDED.status,
          criado_em = EXCLUDED.criado_em
      `, [
        chaveiro.codigo,
        chaveiro.jogo_codigo,
        chaveiro.status,
        chaveiro.criado_em
      ]);
    }

    await client.query('COMMIT');

    // Conferir os dados na nuvem
    const resultadoJogos = await client.query(
      'SELECT COUNT(*) AS total FROM jogos'
    );

    const resultadoChaveiros = await client.query(
      'SELECT COUNT(*) AS total FROM chaveiros'
    );

    console.log('\nMIGRAÇÃO CONCLUÍDA!');
    console.log('Jogos na nuvem:', resultadoJogos.rows[0].total);
    console.log('Chaveiros na nuvem:', resultadoChaveiros.rows[0].total);

  } catch (erro) {
    try {
      await client.query('ROLLBACK');
    } catch {}

    console.error('\nERRO NA MIGRAÇÃO:', erro.message);
    process.exitCode = 1;

  } finally {
    db.close();

    if (client._connected) {
      await client.end();
    }
  }
}

migrar();
