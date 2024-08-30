import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { listarCotacoes, inserirCotacao, excluirCotacao } from '../infra/cotacoes';
import { TextField, Button, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { NavbarComponent } from '../components';
import { useAuth } from '../contexts/AuthContext';

const Cotacoes = ({ buttons }) => {
    const { produtoId } = useParams();
    const [cotacoes, setCotacoes] = useState([]);
    const [preco, setPreco] = useState('');
    const [dataCotacao, setDataCotacao] = useState('');
    const [cotacaoId, setCotacaoId] = useState(null);
    const { user } = useAuth();
    const userEmail = user ? user.email : '';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cotacoesList = await listarCotacoes(produtoId);
                setCotacoes(cotacoesList);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchData();
    }, [produtoId]);

    const handleSubmit = async () => {
        try {
            if (cotacaoId) {
                // Atualizar cotação existente
                await inserirCotacao(produtoId, { preco, dataCotacao });
            } else {
                // Inserir nova cotação
                await inserirCotacao(produtoId, { preco, dataCotacao });
            }
            // Atualizar lista de cotações
            const cotacoesList = await listarCotacoes(produtoId);
            setCotacoes(cotacoesList);
            // Limpar campos
            setPreco('');
            setDataCotacao('');
            setCotacaoId(null);
        } catch (error) {
            console.error('Erro ao submeter dados:', error);
        }
    };

    const handleDelete = async (cotacaoId) => {
        try {
            await excluirCotacao(produtoId, cotacaoId);
            const cotacoesList = await listarCotacoes(produtoId);
            setCotacoes(cotacoesList);
        } catch (error) {
            console.error('Erro ao excluir cotação:', error);
        }
    };
    
    const columns = [
        { field: 'fornecedorNome', headerName: 'Fornecedor', width: 200 },
        { field: 'produtoNome', headerName: 'Produto', width: 200 }, // Nova coluna para o nome do produto
        { field: 'preco', headerName: 'Preço', width: 150 },
        { field: 'dataCotacao', headerName: 'Data da Cotação', width: 150 },
        {
            field: 'actions',
            headerName: 'Ações',
            width: 200,
            renderCell: (params) => (
                <>
                    <Button
                        onClick={() => handleDelete(params.row.id)}
                        variant="contained"
                        color="error"
                    >
                        Excluir
                    </Button>
                </>
            )
        }
    ];

    return (
        <>
            <NavbarComponent buttons={buttons} userEmail={userEmail}/>
            <h1>Gerenciar Cotações</h1>
            <TextField
                label="Preço"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                fullWidth
                style={{ marginBottom: 16 }}
            />
            <TextField
                label="Data da Cotação"
                type="date"
                value={dataCotacao}
                onChange={(e) => setDataCotacao(e.target.value)}
                fullWidth
                InputLabelProps={{
                    shrink: true,
                }}
                style={{ marginBottom: 16 }}
            />
            <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
            >
                {cotacaoId ? 'Atualizar Cotação' : 'Adicionar Cotação'}
            </Button>
            <Paper style={{ height: 400, width: '100%', marginTop: 20 }}>
                <DataGrid
                    rows={cotacoes}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                />
            </Paper>
        </>
    );
};

export default Cotacoes;
