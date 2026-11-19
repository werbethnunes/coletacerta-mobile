import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { listarSolicitacoes, marcarComoColetada, Solicitacao } from '../database/banco';

// Tela de acompanhamento: lista as solicitações salvas no banco de dados do celular.
export default function TelaSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);

  async function carregar() {
    const dados = await listarSolicitacoes();
    setSolicitacoes(dados);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function confirmarColeta(id: number) {
    await marcarComoColetada(id);
    carregar();
  }

  return (
    <View style={estilos.tela}>
      <FlatList
        data={solicitacoes}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={estilos.vazio}>Você ainda não fez nenhuma solicitação de coleta.</Text>}
        renderItem={({ item }) => (
          <View style={estilos.cartao}>
            <Text style={estilos.tipo}>{item.tipo}</Text>
            <Text style={estilos.texto}>Local: {item.local}</Text>
            {item.descricao !== '' && <Text style={estilos.texto}>Descrição: {item.descricao}</Text>}
            <Text style={estilos.texto}>Registrada em: {item.data}</Text>
            <Text style={[estilos.status, item.status === 'Coletada' ? estilos.coletada : estilos.aberta]}>
              Situação: {item.status}
            </Text>

            {item.status === 'Aberta' && (
              <Pressable
                style={estilos.botao}
                onPress={() => confirmarColeta(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`Confirmar que a coleta foi feita em ${item.local}`}
              >
                <Text style={estilos.textoBotao}>A coleta foi feita</Text>
              </Pressable>
            )}
          </View>
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, padding: 16, backgroundColor: '#F4F6F4' },
  vazio: { fontSize: 18, color: '#333333', textAlign: 'center', marginTop: 32 },
  cartao: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#D0D5D0' },
  tipo: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  texto: { fontSize: 16, color: '#333333', marginTop: 2 },
  status: { fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  aberta: { color: '#8A5300' },
  coletada: { color: '#1B5E20' },
  botao: { backgroundColor: '#1B5E20', borderRadius: 8, minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  textoBotao: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});
