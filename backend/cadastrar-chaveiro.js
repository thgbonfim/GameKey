
const Database = require('better-sqlite3');
const readline = require('readline/promises');
const { stdin, stdout } = require('process');

const db = new Database('gamekey.db');
const rl = readline.createInterface({ input: stdin, output: stdout });

async function cadastrar() {
  try {
    console.log('\n===== CADASTRO DE CHAVEIRO GAMEKEY =====\n');

    const codigo = (
      await rl.question('Código exclusivo do chaveiro: ')
    ).trim().toUpperCase();

    const jogoCodigo = (
      await rl.question('Código do jogo associado (ex: GK-SNES-001): ')
    ).trim().toUpperCase();

    if (!codigo || !jogoCodigo) {
      console.log('\nErro: preencha os dois códigos.');
      return;
    }

    const jogo = db.prepare(`
      SELECT codigo, nome
      FROM jogos
      WHERE codigo = ? AND status = 'ativo'
    `).get(jogoCodigo);

    if (!jogo) {
      console.log('\nErro: jogo não encontrado ou desativado.');
      return;
    }

    const existente = db.prepare(`
      SELECT codigo FROM chaveiros WHERE codigo = ?
    `).get(codigo);

    if (existente) {
      console.log('\nErro: este código de chaveiro já está cadastrado.');
      return;
    }

    db.prepare(`
      INSERT INTO chaveiros (codigo, jogo_codigo)
      VALUES (?, ?)
    `).run(codigo, jogoCodigo);

    console.log('\nChaveiro cadastrado com sucesso!');
    console.log('Código:', codigo);
    console.log('Jogo:', jogo.nome);
    console.log('Endereço de teste:');
    console.log(`http://localhost:5173/j/${codigo}`);

  } catch (erro) {
    console.error('\nErro no cadastro:', erro.message);
  } finally {
    rl.close();
    db.close();
  }
}

cadastrar();
