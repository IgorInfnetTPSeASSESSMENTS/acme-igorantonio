import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function inserirFornecedor(novoFornecedor) {
  const docRef = await addDoc(collection(db, "fornecedores"), novoFornecedor);
  return docRef.id;
}

export async function listarFornecedores() {
  try {
    const fornecedoresCollection = collection(db, 'fornecedores');
    const querySnapshot = await getDocs(fornecedoresCollection);
    const fornecedores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return fornecedores;
  } catch (error) {
    console.error('Erro ao listar fornecedores:', error);
    throw error;
  }
}

export async function obterFornecedor(id) {
  const docRef = doc(db, "fornecedores", id);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

export async function excluirFornecedor(id) {
  await deleteDoc(doc(db, "fornecedores", id));
}

export async function atualizarFornecedor(id, fornecedorAtualizado) {
  try {
    const fornecedorRef = doc(db, "fornecedores", id);
    await updateDoc(fornecedorRef, fornecedorAtualizado);
    console.log('Fornecedor atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    throw error;
  }
}