import { addDoc, collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

// Função para adicionar um produto

/**
 * ! MODIFIED 
 */
export async function inserirProduto(dados) {
    try {
        const { fornecedor, ...produtoData } = dados;
        if (fornecedor === "todos") {
            throw new Error('Não é possível adicionar produtos para "Todos os produtos".');
        }

        // Inclui o fornecedorId nos dados do produto
        produtoData.fornecedorId = fornecedor;

        const produtosCollection = collection(db, 'fornecedores', fornecedor, 'produtos');
        await addDoc(produtosCollection, produtoData);
        console.log('Produto adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        throw error;
    }
}

// Função para listar todos os produtos de um fornecedor
export async function listarProdutos(fornecedorId) {
    try {
        if (!fornecedorId) {
            throw new Error("O ID do fornecedor não pode ser indefinido.");
        }
        const produtosCollection = collection(db, 'fornecedores', fornecedorId, 'produtos');
        const querySnapshot = await getDocs(produtosCollection);
        const produtos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return produtos;
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        throw error;
    }
}

/**
 * ! MODIFIED 
 */
// Função para obter um produto específico
export async function obterProduto(fornecedorId, produtoId) {
    try {
        if (!fornecedorId || !produtoId) {
            throw new Error('Fornecedor ID ou Produto ID não fornecido.');
        }
        const produtoDoc = doc(db, 'fornecedores', fornecedorId, 'produtos', produtoId);
        const produtoSnapshot = await getDoc(produtoDoc);
        if (produtoSnapshot.exists()) {
            return { id: produtoSnapshot.id, ...produtoSnapshot.data() };
        } else {
            console.error('Produto não encontrado');
            return null;
        }
    } catch (error) {
        console.error('Erro ao obter produto:', error);
        throw error;
    }
}

// Função para excluir um produto
export async function excluirProduto(fornecedorId, produtoId) {
    try {
        const produtoDoc = doc(db, 'fornecedores', fornecedorId, 'produtos', produtoId);
        await deleteDoc(produtoDoc);
        console.log('Produto excluído com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        throw error;
    }
}

// Função para listar todos os produtos de todos os fornecedores
export async function listarTodosProdutos() {
    try {
        const fornecedoresSnapshot = await getDocs(collection(db, 'fornecedores'));
        const todosProdutos = [];

        for (const fornecedorDoc of fornecedoresSnapshot.docs) {
            const produtosSnapshot = await getDocs(collection(db, `fornecedores/${fornecedorDoc.id}/produtos`));
            produtosSnapshot.forEach(produtoDoc => {
                todosProdutos.push({ id: produtoDoc.id, ...produtoDoc.data() });
            });
        }

        return todosProdutos;
    } catch (error) {
        console.error('Erro ao listar todos os produtos:', error);
        throw error;
    }
}
