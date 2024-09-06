import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography, FormControlLabel, Checkbox, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { inserirProduto, excluirProduto, obterProduto, listarProdutos, listarTodosProdutos } from '../infra/produtos';
import { listarFornecedores } from '../infra/fornecedores'; 
import { BackButton, FixedBox, NavbarComponent } from '../components';
import { useAuth } from '../contexts/AuthContext';

// eslint-disable-next-line react/prop-types
export default function Produtos({ buttons }) {
    const [produtos, setProdutos] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [produtoIdEmEdicao, setProdutoIdEmEdicao] = useState('');
    const [fornecedorId, setFornecedorId] = useState(''); // Adicione o estado para fornecedorId
    const [searchTerm, setSearchTerm] = useState(''); // Adicione o estado para o termo de busca
    const [filteredProducts, setFilteredProducts] = useState([]);
    const { user } = useAuth();
    const userEmail = user ? user.email : '';
    const navigate = useNavigate();
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
            if (produtoIdEmEdicao && fornecedorId) {
                const produto = await obterProduto(fornecedorId, produtoIdEmEdicao);
                if (produto) {
                    setValue('nome', produto.nome);
                    setValue('descricao', produto.descricao);
                    setValue('categoria', produto.categoria);
                    setValue('unidadeMedida', produto.unidadeMedida);
                    setValue('fornecedor', produto.fornecedor);
                }
            } else {
                reset();
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
            reset();
            setProdutoIdEmEdicao('');
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
        }
    }

    async function handleExcluir() {
        try {
            if (produtoIdEmEdicao && fornecedorId) {
                await excluirProduto(fornecedorId, produtoIdEmEdicao);
                atualizarListaProdutos();
                reset();
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

    function handleCheckboxChange(id) {
        navigate(`/cotacoes/${id}`);
    }

    const columns = [
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

    return (
        <>
            <NavbarComponent buttons={buttons} userEmail={userEmail} />
            <Box sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom sx={{marginBottom: 3}}>Cadastro de Produtos</Typography>
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
                    <FormControl fullWidth>
                        <InputLabel id="fornecedor-label">Fornecedor</InputLabel>
                        <Select
                            labelId="fornecedor-label"
                            value={fornecedorId}
                            {...register('fornecedor', { required: 'Fornecedor é obrigatório' })}
                            onChange={(e) => setFornecedorId(e.target.value)}
                            error={!!errors.fornecedor}
                        >
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
                        <Button variant="contained" color="error" type="button" onClick={handleExcluir} disabled={!produtoIdEmEdicao}>Excluir</Button>
                    </Box>
                </Box>
                <Box sx={{ marginTop: 4 }}>
                    <TextField
                        label="Buscar Produto"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Digite o nome do produto"
                        InputLabelProps={{ shrink: true }}
                        sx={{ marginBottom: 2 }}
                    />
                    <DataGrid
                        rows={filteredProducts}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        autoHeight
                        disableSelectionOnClick
                        onRowClick={(params) => setProdutoIdEmEdicao(params.id)}
                    />
                    <FixedBox><BackButton></BackButton></FixedBox>
                </Box>
            </Box>
        </>
    );
}
