import lixeirasMock from '../mocks/lixeiras.json';

export type Lixeira = {
  id: number;
  local: string;
  nivel: number; // quanto a lixeira está cheia, de 0 a 100 (%)
  ultimaLeitura: string;
};

// Consome os dados do mock, que simula a resposta da API dos sensores das lixeiras.
export async function buscarLixeiras(): Promise<Lixeira[]> {
  return lixeirasMock;
}

// Transforma o nível (%) em um texto e uma cor fáceis de entender.
export function situacaoDaLixeira(nivel: number) {
  if (nivel >= 80) {
    return { texto: 'Cheia', cor: '#B71C1C' };
  }
  if (nivel >= 50) {
    return { texto: 'Enchendo', cor: '#8A5300' };
  }
  return { texto: 'Normal', cor: '#1B5E20' };
}
