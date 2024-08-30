import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography, Select, MenuItem, InputLabel, FormControl, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { listarCotacoes, inserirCotacao, excluirCotacao, fetchAllCotacoes } from '../infra/cotacoes';
import { BackButton, FixedBox, NavbarComponent } from '../components';
import { useAuth } from '../contexts/AuthContext';

// eslint-disable-next-line react/prop-types
const Cotacoes = ({ buttons }) => {
    const { produtoId } = useParams();
    const [cotacoes, setCotacoes] = useState([]);
    const [viewMode, setViewMode] = useState('selecionar');
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    const userEmail = user ? user.email : '';
    // eslint-disable-next-line no-unused-vars
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cotacoesList = viewMode === 'todas' ? await fetchAllCotacoes() : await listarCotacoes(produtoId);
                setCotacoes(cotacoesList);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchData();
    }, [produtoId, viewMode]);

    const handleFilterChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCotacoes = cotacoes.filter(cotacao =>
        cotacao.produtoNome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmitForm = async (data) => {
        try {
            if (data.cotacaoId) {
                await inserirCotacao(produtoId, data);
            } else {
                await inserirCotacao(produtoId, data);
            }
            reset();
            const updatedCotacoes = viewMode === 'todas' ? await fetchAllCotacoes() : await listarCotacoes(produtoId);
            setCotacoes(updatedCotacoes);
        } catch (error) {
            console.error('Erro ao submeter dados:', error);
        }
    };

    const handleDelete = async (cotacaoId) => {
        try {
            await excluirCotacao(produtoId, cotacaoId);
            const updatedCotacoes = viewMode === 'todas' ? await fetchAllCotacoes() : await listarCotacoes(produtoId);
            setCotacoes(updatedCotacoes);
        } catch (error) {
            console.error('Erro ao excluir cotação:', error);
        }
    };

    const columns = [
        { field: 'fornecedorNome', headerName: 'Fornecedor', width: 200 },
        { field: 'produtoNome', headerName: 'Produto', width: 200 },
        { field: 'preco', headerName: 'Preço', width: 150 },
        { field: 'dataCotacao', headerName: 'Data da Cotação', width: 150 },
        ...(viewMode === 'todas' ? [] : [{
            field: 'actions',
            headerName: 'Ações',
            width: 200,
            renderCell: (params) => (
                <Button
                    onClick={() => handleDelete(params.row.id)}
                    variant="contained"
                    color="error"
                >
                    Excluir
                </Button>
            )
        }])
    ];

    return (
        <>
            <NavbarComponent buttons={buttons} userEmail={userEmail} />
            <Box sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom sx={{marginBottom: 2}}>Gerenciar Cotações Deste Produto</Typography>
                <Box component="form" onSubmit={handleSubmit(handleSubmitForm)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Preço"
                        {...register('preco', { required: 'Preço é obrigatório' })}
                        error={!!errors.preco}
                        helperText={errors.preco?.message}
                        fullWidth
                    />
                    <TextField
                        label="Data da Cotação"
                        type="date"
                        {...register('dataCotacao', { required: 'Data da Cotação é obrigatória' })}
                        error={!!errors.dataCotacao}
                        helperText={errors.dataCotacao?.message}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="contained" color="primary" type="submit">Salvar</Button>
                    </Box>
                </Box>
                <Typography variant="h4" gutterBottom sx={{paddingTop: 6}}>Visualizar e Filtrar Cotações</Typography>
                <FormControl fullWidth sx={{ marginTop: 2 }}>
                    <InputLabel id="view-mode-label">Modo de Visualização</InputLabel>
                    <Select
                        labelId="view-mode-label"
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="selecionar">Selecione...</MenuItem>
                        <MenuItem value="todas">Todas as cotações</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Buscar Produto"
                    value={searchTerm}
                    onChange={handleFilterChange}
                    placeholder="Digite o nome do produto"
                    fullWidth
                    sx={{ marginTop: 2 }}
                />
                <Paper sx={{ height: 400, width: '100%', marginTop: 2 }}>
                    <DataGrid
                        rows={filteredCotacoes}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        autoHeight
                        disableSelectionOnClick
                    />
                </Paper>
                <FixedBox><BackButton></BackButton></FixedBox>
            </Box>
        </>
    );
};

export default Cotacoes;
