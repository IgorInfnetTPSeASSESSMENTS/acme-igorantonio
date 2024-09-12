// src/services/usuarios.js
import { collection, doc, onSnapshot, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../infra/firebase'; // Certifique-se de que o caminho está correto

// Função para buscar todos os colaboradores
export const fetchUsers = (callback) => {
  const usersCollection = collection(db, 'users');

  // Cria uma consulta para filtrar os usuários com role = "collaborator"
  const q = query(usersCollection, where('role', '==', 'collaborator'));

  // Adiciona um ouvinte para as mudanças na consulta
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const usersData = snapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.data().email, // Inclui o email
      role: doc.data().role,   // Inclui o role
      isBlocked: doc.data().isBlocked
    }));
    callback(usersData);
  }, (error) => {
    console.error("Erro ao buscar dados dos usuários: ", error);
  });

  return unsubscribe; // Retorna a função de limpeza
};

// Função para atualizar o status do usuário
export const toggleUserBlock = async (id, isBlocked) => {
  try {
    await updateDoc(doc(db, 'users', id), {
      isBlocked: !isBlocked
    });
  } catch (error) {
    console.error("Erro ao atualizar o status do usuário: ", error);
  }
};
