import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query } from "firebase/firestore";
import { db } from "./firebase";

export async function inserirContato(fornecedorId, novoContato) {
  const docRef = await addDoc(collection(db, "fornecedores", fornecedorId, "contatos"), novoContato);
  return docRef.id;
}

export async function listarContatos(fornecedorId) {
  let retorno;
  const q = query(collection(db, "fornecedores", fornecedorId, "contatos"));
  await getDocs(q).then((querySnapshot) => {
    retorno = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  });
  return retorno;
}

export async function obterContato(fornecedorId, contatoId) {
  const docRef = doc(db, "fornecedores", fornecedorId, "contatos", contatoId);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

export async function excluirContato(fornecedorId, contatoId) {
  await deleteDoc(doc(db, "fornecedores", fornecedorId, "contatos", contatoId));
}
