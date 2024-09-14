import { db } from './firebase'; // ajuste o caminho conforme necessário
import { collection, getDocs, doc, getDoc, addDoc, deleteDoc, query, where, updateDoc, orderBy, limit } from 'firebase/firestore';

// Função para buscar todas as requisições de compra
export const getAllRequisicoes = async () => {
  const requisicoesRef = collection(db, 'requisicoes');
  const snapshot = await getDocs(requisicoesRef);
  const requisicoes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return requisicoes;
};

// Função para buscar o email do colaborador pelo ID
export const getColaboradorEmailById = async (idDoColaborador) => {
  if (!idDoColaborador) return null;

  const colaboradorRef = doc(db, 'users', idDoColaborador);
  const colaboradorSnap = await getDoc(colaboradorRef);

  if (colaboradorSnap.exists()) {
    return colaboradorSnap.data().email;
  } else {
    return null;
  }
};

// Função para buscar o preço unitário da cotação mais recente de um produto
const getPrecoUnitarioMaisRecente = async (fornecedorId, produtoId) => {
    const cotacoesRef = collection(db, `fornecedores/${fornecedorId}/produtos/${produtoId}/cotacoes`);
    const q = query(cotacoesRef, orderBy('dataCotacao', 'desc'), limit(1));
    const snapshot = await getDocs(q);
  
    if (!snapshot.empty) {
      const cotacao = snapshot.docs[0].data();
      return cotacao.preco;
    } else {
      return null;
    }
  };
  
  // Função para buscar produtos por nome em todos os fornecedores
  export const getProdutosByNome = async (nomeProduto) => {
    const fornecedoresRef = collection(db, 'fornecedores');
    const fornecedoresSnapshot = await getDocs(fornecedoresRef);
  
    let produtosEncontrados = [];
  
    for (const fornecedorDoc of fornecedoresSnapshot.docs) {
      const fornecedorId = fornecedorDoc.id;
      const produtosRef = collection(db, `fornecedores/${fornecedorId}/produtos`);
      const produtosQuery = query(produtosRef, where('nome', '>=', nomeProduto), where('nome', '<=', nomeProduto + '\uf8ff'));
      const produtosSnapshot = await getDocs(produtosQuery);
  
      const produtos = await Promise.all(produtosSnapshot.docs.map(async (doc) => {
        const produtoData = doc.data();
        const precoUnitario = await getPrecoUnitarioMaisRecente(fornecedorId, doc.id);
        return {
          id: doc.id,
          fornecedor: fornecedorDoc.data().nome, // Adiciona o nome do fornecedor
          precoUnitario: precoUnitario || produtoData.precoUnitario, // Atualiza o preço unitário
          ...produtoData,
        };
      }));
  
      produtosEncontrados = [...produtosEncontrados, ...produtos];
    }
  
    return produtosEncontrados;
  };

// Função para adicionar cotação na subcoleção "cotações"
export const adicionarCotacao = async (requisicaoId, cotacaoData) => {
  const cotacoesRef = collection(db, `requisicoes/${requisicaoId}/cotacoes`);
  await addDoc(cotacoesRef, cotacaoData);
};

// Função para buscar todas as cotações de uma requisição
export const getCotacoes = async (requisicaoId) => {
  const cotacoesRef = collection(db, `requisicoes/${requisicaoId}/cotacoes`);
  const snapshot = await getDocs(cotacoesRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Função para excluir uma cotação
export const excluirCotacao = async (requisicaoId, cotacaoId) => {
  const cotacaoRef = doc(db, `requisicoes/${requisicaoId}/cotacoes`, cotacaoId);
  await deleteDoc(cotacaoRef);
};

// Função para atualizar o status da requisição
export const atualizarStatusRequisicao = async (requisicaoId, novoStatus) => {
  const requisicaoRef = doc(db, 'requisicoes', requisicaoId);
  await updateDoc(requisicaoRef, { status: novoStatus });
};
