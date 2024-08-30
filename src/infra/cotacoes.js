import { db } from './firebase'; // Atualize o caminho conforme necessário
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';

// Função para buscar o produto e o fornecedor associado
export async function buscarProdutoEFornecedor(produtoId) {
    try {
        console.log(`Buscando produto com ID: ${produtoId}`);
        
        // Referência ao documento do produto (agora na coleção correta)
        const produtoRef = doc(db, `fornecedores/${produtoId}/produtos/${produtoId}`);
        const produtoSnap = await getDoc(produtoRef);

        if (!produtoSnap.exists()) {
            throw new Error('Produto não encontrado');
        }

        const produtoData = produtoSnap.data();
        const fornecedorId = produtoData.fornecedorId;

        if (!fornecedorId) {
            throw new Error('ID do fornecedor não encontrado no produto');
        }

        // Buscar nome do fornecedor
        const fornecedorRef = doc(db, `fornecedores/${fornecedorId}`);
        const fornecedorSnap = await getDoc(fornecedorRef);

        if (!fornecedorSnap.exists()) {
            throw new Error('Fornecedor não encontrado');
        }

        const fornecedorData = fornecedorSnap.data();
        const fornecedorNome = fornecedorData.nome;

        return { produtoData, fornecedorNome };
    } catch (error) {
        console.error('Erro ao buscar produto e fornecedor:', error);
        throw error;
    }
}

// Função para listar as cotações
export async function listarCotacoes(produtoId) {
    try {
        const { produtoData, fornecedorNome } = await buscarProdutoEFornecedor(produtoId);

        // Referência à coleção de cotações
        const cotacoesRef = collection(db, `fornecedores/${produtoData.fornecedorId}/produtos/${produtoId}/cotacoes`);
        const cotacoesSnap = await getDocs(cotacoesRef);

        if (cotacoesSnap.empty) {
            return [];
        }

        const cotacoes = cotacoesSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return cotacoes;
    } catch (error) {
        console.error('Erro ao listar cotações:', error);
        throw error;
    }
}


// Função para adicionar uma cotação
export async function adicionarCotacao(produtoId, cotacao) {
    try {
        const { produtoData, fornecedorNome } = await buscarProdutoEFornecedor(produtoId);

        const cotacoesRef = collection(db, `fornecedores/${produtoData.fornecedorId}/produtos/${produtoId}/cotacoes`);

        if (!fornecedorNome) {
            throw new Error('Nome do fornecedor não encontrado');
        }

        const novaCotacao = {
            preco: cotacao.preco || '', // Definir um valor padrão se necessário
            data: cotacao.data || '',   // Definir um valor padrão se necessário
            fornecedorId: produtoData.fornecedorId,
            fornecedorNome
        };

        await setDoc(doc(cotacoesRef), novaCotacao);

        console.log('Cotação adicionada com sucesso');
    } catch (error) {
        console.error('Erro ao adicionar cotação:', error);
        throw error;
    }
}
