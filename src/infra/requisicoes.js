import { db } from './firebase';
import { collection, doc, addDoc, getDocs, deleteDoc, query, where } from 'firebase/firestore';

// Função para obter todas as requisições de um colaborador
export const getRequisicoesByColaborador = async (idDoColaborador) => {
  const requisicoesRef = collection(db, 'requisicoes');
  const q = query(requisicoesRef, where('idDoColaborador', '==', idDoColaborador));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      dataCotacao: data.dataCotacao ? data.dataCotacao.toDate() : null,  // Converte Timestamp para Date
    };
  });
};

// Função para excluir uma requisição
export const deleteRequisicao = async (requisicaoId) => {
  const requisicaoRef = doc(db, 'requisicoes', requisicaoId);
  await deleteDoc(requisicaoRef);
};

// Função para adicionar uma nova requisição
export const addRequisicao = async (requisicaoData) => {
  await addDoc(collection(db, 'requisicoes'), requisicaoData);
};
