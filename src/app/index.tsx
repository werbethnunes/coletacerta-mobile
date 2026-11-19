import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { buscarLixeiras, Lixeira, situacaoDaLixeira } from '../services/lixeiras';

// Tela inicial: mostra as lixeiras do bairro e o quanto cada uma está cheia.
export default function TelaLixeiras() {
  const router = useRouter();
  const [lixeiras, setLixeiras] = useState<Lixeira[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const dados = await buscarLixeiras();
      setLixeiras(dados);
      setCarregando(false);
    }
    carregar();
  }, []);

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator size="large" color="#1B5E20" />
        <Text style={estilos.texto}>Carregando lixeiras...</Text>
      </View>
    );
  }

  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo} accessibilityRole="header">
        Lixeiras da Aclimação
      </Text>
      <Text style={estilos.texto}>Veja como está cada lixeira e peça a coleta quando precisar.</Text>

      <Pressable
        style={estilos.botaoSecundario}
        onPress={() => router.push('/solicitacoes')}
        accessibilityRole="button"
        accessibilityLabel="Ver minhas solicitações de coleta"
      >
        <Text style={estilos.textoBotaoSecundario}>Ver minhas solicitações</Text>
      </Pressable>

      <FlatList
        data={lixeiras}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const situacao = situacaoDaLixeira(item.nivel);
          return (
            <View style={estilos.cartao}>
              <Text style={estilos.local}>{item.local}</Text>

              <View
                style={estilos.barraFundo}
                accessible={true}
                accessibilityLabel={`Lixeira ${item.nivel} por cento cheia. Situação: ${situacao.texto}`}
              >
                <View style={[estilos.barraNivel, { width: `${item.nivel}%`, backgroundColor: situacao.cor }]} />
              </View>

              <Text style={[estilos.situacao, { color: situacao.cor }]}>
                {situacao.texto} — {item.nivel}% cheia
              </Text>
              <Text style={estilos.leitura}>Última leitura do sensor: {item.ultimaLeitura}</Text>

              <Pressable
                style={estilos.botao}
                onPress={() => router.push({ pathname: '/solicitar', params: { local: item.local } })}
                accessibilityRole="button"
                accessibilityLabel={`Solicitar coleta para a lixeira em ${item.local}`}
              >
                <Text style={estilos.textoBotao}>Solicitar coleta</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, padding: 16, backgroundColor: '#F4F6F4' },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F6F4' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  texto: { fontSize: 16, color: '#333333', marginTop: 4, marginBottom: 12 },
  cartao: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#D0D5D0' },
  local: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  barraFundo: { height: 16, backgroundColor: '#E0E0E0', borderRadius: 8 },
  barraNivel: { height: 16, borderRadius: 8 },
  situacao: { fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  leitura: { fontSize: 14, color: '#4A4A4A', marginTop: 2, marginBottom: 12 },
  botao: { backgroundColor: '#1B5E20', borderRadius: 8, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  textoBotao: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  botaoSecundario: { borderWidth: 2, borderColor: '#1B5E20', borderRadius: 8, minHeight: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  textoBotaoSecundario: { color: '#1B5E20', fontSize: 18, fontWeight: 'bold' },
});
