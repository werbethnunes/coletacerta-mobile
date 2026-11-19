import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

import { salvarSolicitacao } from '../database/banco';

const TIPOS = ['Lixeira cheia', 'Coleta atrasada', 'Lixo na calçada'];

// Tela de formulário: o cidadão registra uma solicitação de coleta.
export default function TelaSolicitar() {
  const router = useRouter();
  // Quando o cidadão vem da lista de lixeiras, o local já chega preenchido.
  const parametros = useLocalSearchParams<{ local?: string }>();

  const [local, setLocal] = useState(parametros.local ?? '');
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erro, setErro] = useState('');

  async function enviar() {
    if (local.trim() === '' || tipo === '') {
      setErro('Informe o local e escolha o tipo do problema.');
      return;
    }
    await salvarSolicitacao(local.trim(), tipo, descricao.trim());
    router.replace('/solicitacoes');
  }

  return (
    <ScrollView style={estilos.tela} contentContainerStyle={estilos.conteudo}>
      <Text style={estilos.rotulo}>Onde está o problema?</Text>
      <TextInput
        style={estilos.campo}
        value={local}
        onChangeText={setLocal}
        placeholder="Ex.: Rua Muniz de Sousa, 450"
        placeholderTextColor="#5F5F5F"
        accessibilityLabel="Local do problema"
      />

      <Text style={estilos.rotulo}>Qual é o problema?</Text>
      {TIPOS.map((opcao) => {
        const selecionado = tipo === opcao;
        return (
          <Pressable
            key={opcao}
            style={[estilos.opcao, selecionado && estilos.opcaoSelecionada]}
            onPress={() => {
              setTipo(opcao);
              setErro('');
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected: selecionado }}
            accessibilityLabel={opcao}
          >
            <Text style={[estilos.textoOpcao, selecionado && estilos.textoOpcaoSelecionada]}>
              {selecionado ? '● ' : '○ '}
              {opcao}
            </Text>
          </Pressable>
        );
      })}

      <Text style={estilos.rotulo}>Quer contar mais alguma coisa? (opcional)</Text>
      <TextInput
        style={[estilos.campo, estilos.campoGrande]}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Ex.: o lixo está espalhado há 2 dias"
        placeholderTextColor="#5F5F5F"
        multiline
        accessibilityLabel="Descrição do problema, opcional"
      />

      {erro !== '' && (
        <Text style={estilos.erro} accessibilityRole="alert">
          {erro}
        </Text>
      )}

      <Pressable
        style={estilos.botao}
        onPress={enviar}
        accessibilityRole="button"
        accessibilityLabel="Enviar solicitação de coleta"
      >
        <Text style={estilos.textoBotao}>Enviar solicitação</Text>
      </Pressable>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#F4F6F4' },
  conteudo: { padding: 16 },
  rotulo: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginTop: 16, marginBottom: 8 },
  campo: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#6B6B6B', borderRadius: 8, padding: 12, fontSize: 18, color: '#1A1A1A', minHeight: 48 },
  campoGrande: { minHeight: 96, textAlignVertical: 'top' },
  opcao: { backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: '#6B6B6B', borderRadius: 8, padding: 12, minHeight: 48, justifyContent: 'center', marginBottom: 8 },
  opcaoSelecionada: { backgroundColor: '#1B5E20', borderColor: '#1B5E20' },
  textoOpcao: { fontSize: 18, color: '#1A1A1A' },
  textoOpcaoSelecionada: { color: '#FFFFFF', fontWeight: 'bold' },
  erro: { fontSize: 16, color: '#B71C1C', fontWeight: 'bold', marginTop: 16 },
  botao: { backgroundColor: '#1B5E20', borderRadius: 8, minHeight: 52, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  textoBotao: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});
