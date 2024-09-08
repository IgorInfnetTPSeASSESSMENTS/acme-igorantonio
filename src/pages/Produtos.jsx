import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography, FormControlLabel, Checkbox, MenuItem, Select, InputLabel, FormControl, Modal, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { inserirProduto, excluirProduto, obterProduto, listarProdutos, listarTodosProdutos } from '../infra/produtos';
import { listarFornecedores } from '../infra/fornecedores';
import { NavbarComponent } from '../components';
import { useAuth } from '../contexts/AuthContext';
import CloseIcon from '@mui/icons-material/Close';
import Cotacoes from './Cotacoes'; // Importe o componente Cotacoes

// eslint-disable-next-line react/prop-types
export default function Produtos({ buttons }) {
    const [produtos, setProdutos] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [produtoIdEmEdicao, setProdutoIdEmEdicao] = useState('');
    const [fornecedorId, setFornecedorId] = useState('selecionar');
    const [searchTerm, setSearchTerm] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [produtoIdSelecionado, setProdutoIdSelecionado] = useState(null);
    const [checked, setChecked] = useState(false); // Novo estado para o checkbox
    const { user } = useAuth();
    const userEmail = user ? user.email : '';
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();


    useEffect(() => {
        async function fetchFornecedores() {
            const fornecedores = await listarFornecedores();
            setFornecedores(fornecedores);
        }
        fetchFornecedores();
    }, []);

    useEffect(() => {
        async function fetchProdutos() {
            if (fornecedorId === "todos") {
                const produtos = await listarTodosProdutos();
                setProdutos(produtos);
            } else if (fornecedorId) {
                const produtos = await listarProdutos(fornecedorId);
                setProdutos(produtos);
            }
        }
        fetchProdutos();
    }, [fornecedorId]);

    useEffect(() => {
        async function fetchProduto() {
            if (produtoIdEmEdicao) {
                const produto = await obterProduto(fornecedorId, produtoIdEmEdicao);
                if (produto) {
                    setValue('nome', produto.nome);
                    setValue('descricao', produto.descricao);
                    setValue('categoria', produto.categoria);
                    setValue('unidadeMedida', produto.unidadeMedida);
                    setValue('fornecedor', produto.fornecedorId); // Atualiza o fornecedor no formulário
                }
            } else {
                reset({ fornecedor: fornecedorId }); // Mantém o fornecedor selecionado após o reset
            }
        }
        fetchProduto();
    }, [produtoIdEmEdicao, fornecedorId, reset, setValue]);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredProducts(produtos);
        } else {
            const filtered = produtos.filter(produto =>
                produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        }
    }, [searchTerm, produtos]);

    async function submeterDados(dados) {
        try {
            await inserirProduto(dados);
            atualizarListaProdutos();
            reset({ fornecedor: fornecedorId }); // Mantém o fornecedor selecionado após o reset
            setProdutoIdEmEdicao('');
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
        }
    }

    async function handleExcluir() {
        try {
            if (produtoIdEmEdicao) {
                await excluirProduto(fornecedorId, produtoIdEmEdicao);
                atualizarListaProdutos();
                reset({ fornecedor: fornecedorId }); // Mantém o fornecedor selecionado após o reset
                setProdutoIdEmEdicao('');
            }
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
        }
    }

    async function atualizarListaProdutos() {
        try {
            if (fornecedorId === "todos") {
                const todosProdutos = await listarTodosProdutos();
                setProdutos(todosProdutos);
            } else if (fornecedorId) {
                const produtosAtualizados = await listarProdutos(fornecedorId);
                setProdutos(produtosAtualizados);
            }
        } catch (error) {
            console.error('Erro ao atualizar lista de produtos:', error);
        }
    }

    const handleCheckboxChange = (produtoId) => {
        setProdutoIdSelecionado(produtoId);
        setChecked(true); // Marca o checkbox
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setChecked(false); // Desmarca o checkbox
        setProdutoIdSelecionado(null);
    };

    // Define as colunas dinamicamente com base na seleção do fornecedor
    const columns = [
        ...(fornecedorId === 'todos' ? [
            { field: 'fornecedor', headerName: 'Fornecedor', flex: 1 }, // Adiciona a coluna Fornecedor
        ] : []),
        { field: 'nome', headerName: 'Nome', flex: 1 },
        { field: 'descricao', headerName: 'Descrição', flex: 1 },
        { field: 'categoria', headerName: 'Categoria', flex: 1 },
        { field: 'unidadeMedida', headerName: 'Unidade de Medida', flex: 1 },
        {
            field: 'cotacoes',
            headerName: 'Cotações',
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checked && params.id === produtoIdSelecionado}
                            onChange={() => handleCheckboxChange(params.id)}
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        />
                    }
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                />
            ),
            width: 120,
        },
    ];

    // Adiciona o nome do fornecedor aos produtos quando necessário
    const prepareProductsForDisplay = () => {
        if (fornecedorId === 'todos') {
            return produtos.map(produto => ({
                ...produto,
                fornecedor: fornecedores.find(fornecedor => fornecedor.id === produto.fornecedorId)?.nome || 'Desconhecido',
            }));
        }
        return produtos;
    };

    return (
        <>
            <NavbarComponent buttons={buttons} userEmail={userEmail} />
            <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: '5rem' }}> 
                <Box sx={{ padding: 4, width: '70%'}}>
                    <Typography variant="h4" gutterBottom sx={{ marginBottom: 3}}>Cadastro de Produtos</Typography>
                    <Box component="form" onSubmit={handleSubmit(submeterDados)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Nome"
                            {...register('nome', { required: 'Nome é obrigatório' })}
                            error={!!errors.nome}
                            helperText={errors.nome?.message}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Descrição"
                            {...register('descricao')}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Categoria"
                            {...register('categoria', { required: 'Categoria é obrigatória' })}
                            error={!!errors.categoria}
                            helperText={errors.categoria?.message}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Unidade de Medida"
                            {...register('unidadeMedida')}
                            InputLabelProps={{ shrink: true }}
                        />
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="fornecedor-label">Selecionar Fornecedor</InputLabel>
                            <Select
                                label="Selecionar Fornecedor"
                                id="fornecedor-select"
                                value={fornecedorId}
                                {...register('fornecedor', { required: 'Fornecedor é obrigatório' })}
                                onChange={(e) => {setFornecedorId(e.target.value)} }
                                error={!!errors.fornecedor}
                                // Adiciona um rótulo visual para o Select
                            >
                                <MenuItem value="selecionar">Selecione...</MenuItem>
                                <MenuItem value="todos">Todos os produtos (Apenas Listar)</MenuItem>
                                {fornecedores.map((fornecedor) => (
                                    <MenuItem key={fornecedor.id} value={fornecedor.id}>
                                        {fornecedor.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button variant="contained" color="primary" type="submit">Salvar</Button>
                            <Button variant="contained" color="error" type="button" onClick={handleExcluir} disabled={fornecedorId === 'todos' || !produtoIdEmEdicao}>Excluir</Button>
                        </Box>
                    </Box>
                    <Box sx={{ marginTop: 4 }}>
                        <TextField
                            label="Buscar Produto"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Digite o nome do produto"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                    <Box sx={{ marginTop: 4, height: 400 }}>
                        <DataGrid
                            rows={prepareProductsForDisplay()}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            disableSelectionOnClick
                            onRowClick={(params) => {
                                setProdutoIdEmEdicao(params.id);
                            }}
                        />
                    </Box>
                </Box>
            </Box>
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ 
                    padding: 4,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    width: '50%',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                }}>
                    <IconButton
                        sx={{ position: 'absolute', top: 10, right: 10 }}
                        onClick={handleCloseModal}
                    >
                        <CloseIcon />
                    </IconButton>
                        <Cotacoes produtoId={produtoIdSelecionado} />
                </Box>
            </Modal>
        </>
    );
}
