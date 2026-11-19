import * as SQLite from 'expo-sqlite';

export type Solicitacao = {
  id: number;
  local: string;
  tipo: string;
  descricao: string;
  data: string;
  status: string; // 'Aberta' ou 'Coletada'
};

// Abre (ou cria) o banco de dados SQLite que fica salvo no celular
// e cria a tabela na primeira vez que o app é aberto.
async function abrirBanco() {
  const banco = await SQLite.openDatabaseAsync('coletacerta.db');
  await banco.execAsync(`
    CREATE TABLE IF NOT EXISTS solicitacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      local TEXT NOT NULL,
      tipo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      data TEXT NOT NULL,
      status TEXT NOT NULL
    );
  `);
  return banco;
}

// O banco é aberto uma única vez e reaproveitado pelas funções abaixo.
const bancoPronto = abrirBanco();

export async function salvarSolicitacao(local: string, tipo: string, descricao: string) {
  const banco = await bancoPronto;
  const data = new Date().toLocaleString('pt-BR');
  await banco.runAsync(
    'INSERT INTO solicitacoes (local, tipo, descricao, data, status) VALUES (?, ?, ?, ?, ?)',
    local,
    tipo,
    descricao,
    data,
    'Aberta'
  );
}

export async function listarSolicitacoes() {
  const banco = await bancoPronto;
  return await banco.getAllAsync<Solicitacao>('SELECT * FROM solicitacoes ORDER BY id DESC');
}

export async function marcarComoColetada(id: number) {
  const banco = await bancoPronto;
  await banco.runAsync('UPDATE solicitacoes SET status = ? WHERE id = ?', 'Coletada', id);
}
