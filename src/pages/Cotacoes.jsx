import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, TextField, Typography } from '@mui/material';
import { adicionarCotacao, listarCotacoes } from '../infra/cotacoes'; // Atualize os caminhos se necessário
import { useAuth } from '../contexts/AuthContext';
import { NavbarComponent } from '../components';

export default function Cotacoes({ buttons }) {
    const { produtoId } = useParams();
    const [cotacoes, setCotacoes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCotacoes, setFilteredCotacoes] = useState([]);
    const { user } = useAuth();
    const userEmail = user ? user.email : '';
    const { register, handleSubmit, reset } = useForm();

    // Função para buscar e listar cotações
    useEffect(() => {
        async function fetchCotacoes() {
            try {
                if (produtoId) {
                    const cotacoesData = await listarCotacoes(produtoId);
                    setCotacoes(cotacoesData);
                }
            } catch (error) {
                console.error('Erro ao buscar cotações:', error);
            }
        }
        fetchCotacoes();
    }, [produtoId]);

    // Filtra as cotações com base no termo de busca
    useEffect(() => {
        if (searchTerm === '') {
            setFilteredCotacoes(cotacoes);
        } else {
            const filtered = cotacoes.filter(cotacao =>
                cotacao.fornecedorNome.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCotacoes(filtered);
        }
    }, [searchTerm, cotacoes]);

    // Função para adicionar uma nova cotação
    async function adicionarNovaCotacao(dados) {
        const { preco, data } = dados;

        try {
            await adicionarCotacao(produtoId, {
                preco,
                data
            });
            // Atualiza a lista de cotações após adicionar
            const cotacoesData = await listarCotacoes(produtoId);
            setCotacoes(cotacoesData);
            reset();
        } catch (error) {
            console.error('Erro ao adicionar cotação:', error);
        }
    }

    const columns = [
        { field: 'preco', headerName: 'Preço', flex: 1 },
        { field: 'data', headerName: 'Data', flex: 1 },
        { field: 'fornecedorNome', headerName: 'Fornecedor', flex: 1 },
    ];

    return (
        <>
            <NavbarComponent buttons={buttons} userEmail={userEmail} />
            <Box sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom>Cotações</Typography>
                <Box component="form" onSubmit={handleSubmit(adicionarNovaCotacao)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Preço"
                        {...register('preco', { required: 'Preço é obrigatório' })}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Data"
                        type="date"
                        {...register('data', { required: 'Data é obrigatória' })}
                        InputLabelProps={{ shrink: true }}
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="contained" color="primary" type="submit">Adicionar Cotação</Button>
                    </Box>
                </Box>
                <Box sx={{ marginTop: 4 }}>
                    <TextField
                        label="Buscar Cotação"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        fullWidth
                    />
                    <div style={{ height: 400, width: '100%', marginTop: 2 }}>
                        <DataGrid rows={filteredCotacoes} columns={columns} pageSize={5} />
                    </div>
                </Box>
            </Box>
        </>
    );
}
