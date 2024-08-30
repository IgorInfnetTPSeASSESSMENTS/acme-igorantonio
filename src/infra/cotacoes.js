import { db } from './firebase'; // Atualize o caminho conforme necessário
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { listarFornecedores, obterFornecedor } from './fornecedores';

// Função para buscar o produto e o fornecedor associado
export async function buscarProdutoEFornecedor(produtoId) {
    try {
        console.log(`Buscando produto com ID: ${produtoId}`);

        // Obter a lista de fornecedores
        const fornecedores = await listarFornecedores();

        for (const fornecedor of fornecedores) {
            const fornecedorId = fornecedor.id;

            // Referência ao documento do produto
            const produtoRef = doc(db, `fornecedores/${fornecedorId}/produtos/${produtoId}`);
            const produtoSnap = await getDoc(produtoRef);

            if (produtoSnap.exists()) {
                const produtoData = produtoSnap.data();
                console.log(`Dados do produto: ${JSON.stringify(produtoData)}`);

                if (!produtoData.fornecedorId) {
                    console.error(`ID do fornecedor não encontrado no produto com ID ${produtoId}`);
                    throw new Error('ID do fornecedor não encontrado no produto');
                }

                // Buscar nome do fornecedor
                const fornecedorData = await obterFornecedor(produtoData.fornecedorId);

                if (!fornecedorData) {
                    console.error(`Fornecedor com ID ${produtoData.fornecedorId} não encontrado`);
                    throw new Error('Fornecedor não encontrado');
                }

                const fornecedorNome = fornecedorData.nome;
                console.log(`Dados do fornecedor: ${JSON.stringify(fornecedorData)}`);

                return { produtoData, fornecedorNome };
            }
        }

        throw new Error('Produto não encontrado em nenhum fornecedor');
    } catch (error) {
        console.error('Erro ao buscar produto e fornecedor:', error);
        throw error;
    }
}


export async function obterCotacao(produtoId, cotacaoId) {
    try {
        // Obtenha o produto e o fornecedor associado
        const { produtoData } = await buscarProdutoEFornecedor(produtoId);
        const fornecedorId = produtoData.fornecedorId;

        if (!fornecedorId) {
            throw new Error('ID do fornecedor não encontrado no produto');
        }

        const cotacaoRef = doc(db, `fornecedores/${fornecedorId}/produtos/${produtoId}/cotacoes/${cotacaoId}`);
        const cotacaoSnap = await getDoc(cotacaoRef);

        if (cotacaoSnap.exists()) {
            return cotacaoSnap.data();
        } else {
            console.error('Cotação não encontrada');
            return null;
        }
    } catch (error) {
        console.error('Erro ao obter cotação:', error);
        throw error;
    }
}

// Função para listar as cotações

export async function inserirCotacao(produtoId, dados) {
    try {
        // Primeiro, obtenha o produto e o fornecedor associado
        const { produtoData } = await buscarProdutoEFornecedor(produtoId);
        const fornecedorId = produtoData.fornecedorId;

        if (!fornecedorId) {
            throw new Error('ID do fornecedor não encontrado no produto');
        }

        const cotacoesRef = collection(db, `fornecedores/${fornecedorId}/produtos/${produtoId}/cotacoes`);

        // Verificar se a coleção já contém documentos
        const cotacoesSnapshot = await getDocs(cotacoesRef);
        if (cotacoesSnapshot.empty) {
            console.log("Coleção 'cotações' ainda não existe. Criando a primeira cotação...");
        }

        // Criar uma nova cotação
        const novaCotacaoRef = doc(cotacoesRef);
        await setDoc(novaCotacaoRef, dados);

    } catch (error) {
        console.error('Erro ao inserir cotação:', error);
        throw error;
    }
}

export async function excluirCotacao(produtoId, cotacaoId) {
    try {
        // Obtenha o produto e o fornecedor associado
        const { produtoData } = await buscarProdutoEFornecedor(produtoId);
        const fornecedorId = produtoData.fornecedorId;

        if (!fornecedorId) {
            throw new Error('ID do fornecedor não encontrado no produto');
        }

        const cotacaoRef = doc(db, `fornecedores/${fornecedorId}/produtos/${produtoId}/cotacoes/${cotacaoId}`);
        await deleteDoc(cotacaoRef);
    } catch (error) {
        console.error('Erro ao excluir cotação:', error);
        throw error;
    }
}

export async function listarCotacoes2(produtoId) {
    try {
        // Obtenha o produto e o fornecedor associado
        const { produtoData } = await buscarProdutoEFornecedor(produtoId);
        const fornecedorId = produtoData.fornecedorId;

        if (!fornecedorId) {
            throw new Error('ID do fornecedor não encontrado no produto');
        }

        const cotacoesRef = collection(db, `fornecedores/${fornecedorId}/produtos/${produtoId}/cotacoes`);
        const querySnapshot = await getDocs(cotacoesRef);
        const cotacoes = [];

        for (const doc of querySnapshot.docs) {
            const data = doc.data();

            // Adiciona os dados da cotação com o nome do fornecedor
            cotacoes.push({
                id: doc.id,
                preco: data.preco,
                dataCotacao: data.dataCotacao,
                fornecedorNome: produtoData.fornecedorNome // Adicione o nome do fornecedor
            });
        }

        return cotacoes;
    } catch (error) {
        console.error('Erro ao listar cotações:', error);
        throw error;
    }
}


export async function listarCotacoes(produtoId) {
    try {
        // Obtenha o produto e o fornecedor associado
        const { produtoData, fornecedorNome } = await buscarProdutoEFornecedor(produtoId);
        const fornecedorId = produtoData.fornecedorId;

        if (!fornecedorId) {
            throw new Error('ID do fornecedor não encontrado no produto');
        }

        const cotacoesRef = collection(db, `fornecedores/${fornecedorId}/produtos/${produtoId}/cotacoes`);
        const querySnapshot = await getDocs(cotacoesRef);
        const cotacoes = [];

        for (const doc of querySnapshot.docs) {
            const data = doc.data();

            // Adiciona os dados da cotação com o nome do fornecedor e do produto
            cotacoes.push({
                id: doc.id,
                preco: data.preco,
                dataCotacao: data.dataCotacao,
                fornecedorNome: fornecedorNome, // Nome do fornecedor
                produtoNome: produtoData.nome // Nome do produto
            });
        }

        return cotacoes;
    } catch (error) {
        console.error('Erro ao listar cotações:', error);
        throw error;
    }
}
