import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, TextField, Typography, Select, MenuItem, InputLabel, FormControl} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { listarCotacoes, inserirCotacao, excluirCotacao, fetchAllCotacoes } from '../../infra/cotacoes';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Timestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line react/prop-types
const Cotacoes = ({ produtoId }) => {
    const [cotacoes, setCotacoes] = useState([]);
    const [viewMode, setViewMode] = useState('selecionar');
    const [searchTerm, setSearchTerm] = useState('');
    const { t } = useTranslation();

    // eslint-disable-next-line no-unused-vars
    const { control, handleSubmit, reset, register, setValue, formState: { errors } } = useForm({
        defaultValues: {
            dataCotacao: dayjs() // Define a data padrão como o dia atual
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cotacoesList = viewMode === 'todas' ? await fetchAllCotacoes() : await listarCotacoes(produtoId);
                // Converte o Timestamp para dayjs antes de definir o estado
                const updatedCotacoes = cotacoesList.map(cotacao => ({
                    ...cotacao,
                    dataCotacao: cotacao.dataCotacao instanceof Timestamp 
                        ? dayjs(cotacao.dataCotacao.toDate()) 
                        : dayjs(cotacao.dataCotacao) // Converte para dayjs se já for uma data
                }));
                setCotacoes(updatedCotacoes);
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
            // Converte a data do form para um formato de data padrão antes de enviar para o backend
            const formattedData = {
                ...data,
                dataCotacao: dayjs(data.dataCotacao).toDate() // Converte dayjs para Date antes de salvar
            };
            await inserirCotacao(produtoId, formattedData);
            reset();
            const updatedCotacoes = viewMode === 'todas' ? await fetchAllCotacoes() : await listarCotacoes(produtoId);
            // Converte a data para dayjs após atualizar o estado
            const cotacoesComDataAtualizada = updatedCotacoes.map(cotacao => ({
                ...cotacao,
                dataCotacao: cotacao.dataCotacao instanceof Timestamp 
                    ? dayjs(cotacao.dataCotacao.toDate()) 
                    : dayjs(cotacao.dataCotacao) // Converte para dayjs se já for uma data
            }));
            setCotacoes(cotacoesComDataAtualizada);
        } catch (error) {
            console.error('Erro ao submeter dados:', error);
        }
    };

    const handleDelete = async (cotacaoId) => {
        try {
            await excluirCotacao(produtoId, cotacaoId);
            const updatedCotacoes = viewMode === 'todas' ? await fetchAllCotacoes() : await listarCotacoes(produtoId);
            // Converte a data para dayjs após atualizar o estado
            const cotacoesComDataAtualizada = updatedCotacoes.map(cotacao => ({
                ...cotacao,
                dataCotacao: cotacao.dataCotacao instanceof Timestamp 
                    ? dayjs(cotacao.dataCotacao.toDate()) 
                    : dayjs(cotacao.dataCotacao) // Converte para dayjs se já for uma data
            }));
            setCotacoes(cotacoesComDataAtualizada);
        } catch (error) {
            console.error('Erro ao excluir cotação:', error);
        }
    };

    const columns = [
        { field: 'fornecedorNome', headerName: t('supplierName'), width: 200 },
        { field: 'produtoNome', headerName: t('products'), width: 200 },
        { field: 'preco', headerName: t('price'), width: 150 },
        { field: 'dataCotacao', headerName: t('quoteDate'), width: 150, 
            renderCell: (params) => dayjs(params.value).isValid() 
                ? dayjs(params.value).format('DD/MM/YYYY') 
                : t('invalidDate') // Formata a data para exibição ou mostra 'Data Inválida'
        },
        ...(viewMode === 'todas' ? [] : [{
            field: 'actions',
            headerName: t('actions'),
            width: 200,
            renderCell: (params) => (
                <Button
                    onClick={() => handleDelete(params.row.id)}
                    variant="contained"
                    color="error"
                >
                    {t('delete')}
                </Button>
            )
        }])
    ];

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ marginBottom: 2 }}>
                {t('manageProductQuotes')}
            </Typography>
            <Box component="form" onSubmit={handleSubmit(handleSubmitForm)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label={t('price')}
                    {...register('preco', { required: t('priceRequired') })}
                    error={!!errors.preco}
                    helperText={errors.preco?.message}
                    fullWidth
                />
                <Controller
                    name="dataCotacao"
                    control={control}
                    rules={{ required: t('quoteDateRequired') }}
                    render={({ field }) => (
                        <DatePicker
                            label={t('quoteDate')}
                            {...field}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    error={!!errors.dataCotacao}
                                    helperText={errors.dataCotacao?.message}
                                    fullWidth
                                />
                            )}
                            value={field.value ? dayjs(field.value) : dayjs()} // Define a data padrão como o dia atual
                            onChange={(date) => field.onChange(date ? date.toDate() : null)}
                        />
                    )}
                />
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" color="primary" type="submit">
                        {t('save')}
                    </Button>
                </Box>
            </Box>
            <Box sx={{ marginTop: 4, height: 400 }}>
                    <DataGrid
                        rows={filteredCotacoes}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
                    />
            </Box>
            <Typography variant="h4" gutterBottom sx={{ paddingTop: 6 }}>
                {t('viewAndFilterQuotes')}
            </Typography>
            <FormControl fullWidth sx={{ marginTop: 2 }}>
                <InputLabel id="view-mode-label">{t('viewMode')}</InputLabel>
                <Select
                    label={t('viewMode')}
                    labelId="view-mode-label"
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="selecionar">{t('select')}</MenuItem>
                    <MenuItem value="todas">{t('allQuotesListOnly')}</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label={t('filterQuotesByProductName')}
                value={searchTerm}
                onChange={handleFilterChange}
                placeholder={t('enterProductName')}
                fullWidth
                sx={{ marginTop: 2 }}
            />
        </Box>
    );
};

export default Cotacoes;
