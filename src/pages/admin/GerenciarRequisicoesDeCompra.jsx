import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, Modal, TextField, IconButton } from '@mui/material';
import { useForm } from 'react-hook-form';
import {
  getAllRequisicoes,
  getColaboradorEmailById,
  getProdutosByNome,
  adicionarCotacao,
  getCotacoes,
  excluirCotacao,
  atualizarStatusRequisicao,
} from '../../infra/gerenciarRequisicoes'; 
import { NavbarComponent } from '../../components'; 
import { useAuth } from '../../contexts/AuthContext'; 
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line react/prop-types
export default function GerenciarRequisicoesDeCompra({ buttons }) {
  const { user } = useAuth();
  const userEmail = user ? user.email : '';
  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm();

  const [requisicoes, setRequisicoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequisicao, setSelectedRequisicao] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [buscaProduto, setBuscaProduto] = useState('');
  const [cotações, setCotações] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRequisicoes = async () => {
      const requisicoesData = await getAllRequisicoes();
      const requisicoesWithEmails = await Promise.all(
        requisicoesData.map(async (req) => {
          const email = await getColaboradorEmailById(req.idDoColaborador);
          return { ...req, emailColaborador: email };
        })
      );
      setRequisicoes(requisicoesWithEmails);
      setLoading(false);
    };

    fetchRequisicoes();
  }, []);

  const handleOpenModal = async (requisicao) => {
    setSelectedRequisicao(requisicao);
    setModalOpen(true);
    setValue('idRequisicao', requisicao.id); // Preenche o ID da requisição no campo

    // Buscar as cotações existentes
    const cotacoesData = await getCotacoes(requisicao.id);
    setCotações(cotacoesData);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRequisicao(null);
  };

  const onSubmitCotacao = async (data) => {
    if (selectedRequisicao) {
      // Verifica o número de cotações existentes
      if (cotações.length >= 3) {
        alert(t('notPossibleError'));
        return;
      }

      // Adiciona a nova cotação
      await adicionarCotacao(selectedRequisicao.id, data);
      reset();

      // Atualiza as cotações
      const cotacoesData = await getCotacoes(selectedRequisicao.id);
      setCotações(cotacoesData);

      // Determina o novo status
      let novoStatus = t('open');
      if (cotacoesData.length > 0) {
        novoStatus = t('inQuotation');
      }
      if (cotacoesData.length >= 3) {
        novoStatus = t('quoted');
      }

      console.log(`Atualizando status para: ${novoStatus}`); // Debug
      await atualizarStatusRequisicao(selectedRequisicao.id, novoStatus);

      // Atualiza a lista de requisições
      const requisicoesData = await getAllRequisicoes();
      const requisicoesWithEmails = await Promise.all(
        requisicoesData.map(async (req) => {
          const email = await getColaboradorEmailById(req.idDoColaborador);
          return { ...req, emailColaborador: email };
        })
      );
      setRequisicoes(requisicoesWithEmails);
    }
  };

  const handleExcluirCotacao = async (cotacaoId) => {
    if (selectedRequisicao) {
      // Exclui a cotação
      await excluirCotacao(selectedRequisicao.id, cotacaoId);

      // Atualiza as cotações
      const cotacoesData = await getCotacoes(selectedRequisicao.id);
      setCotações(cotacoesData);

      // Determina o novo status
      let novoStatus = t('open');
      if (cotacoesData.length > 0) {
        novoStatus = t('inQuotation');
      }
      if (cotacoesData.length >= 3) {
        novoStatus = t('quoted');
      }

      console.log(`Atualizando status para: ${novoStatus}`); // Debug
      await atualizarStatusRequisicao(selectedRequisicao.id, novoStatus);

      // Atualiza a lista de requisições
      const requisicoesData = await getAllRequisicoes();
      const requisicoesWithEmails = await Promise.all(
        requisicoesData.map(async (req) => {
          const email = await getColaboradorEmailById(req.idDoColaborador);
          return { ...req, emailColaborador: email };
        })
      );
      setRequisicoes(requisicoesWithEmails);
    }
  };

  const handleBuscarProduto = async (nomeProduto) => {
    if (nomeProduto) {
      const produtosEncontrados = await getProdutosByNome(nomeProduto);
      setProdutos(produtosEncontrados);
    } else {
      setProdutos([]);
    }
  };

  const handleSelecionarProduto = (produto) => {
    setValue('nomeProduto', produto.nome);
    setValue('fornecedor', produto.fornecedor);
    setValue('precoUnitario', produto.precoUnitario);
    setValue('observacoes', produto.descricao)
  };

  const columnsRequisicoes = [
    { field: 'emailColaborador', headerName: t('collaboratorEmail'), width: 250 },
    { field: 'produto', headerName: t('productName'), width: 200 },
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'dataCotacao',
      headerName: t('requestDate'),
      width: 200,
      renderCell: (params) => (
        <span>{dayjs(params.value.toDate()).format('DD/MM/YYYY HH:mm:ss')}</span>
      ),
    },
    {
      field: 'cotacao',
      headerName: t('quotation'),
      width: 150,
      renderCell: (params) => (
        <Button variant="contained" onClick={() => handleOpenModal(params.row)}>
          {t('start')}
        </Button>
      ),
    },
  ];

  const columnsProdutos = [
    { field: 'nome', headerName: t('productName'), width: 200 },
    { field: 'fornecedor', headerName: t('supplierName'), width: 200 },
    { field: 'precoUnitario', headerName: t('unitPrice'), width: 150 },
    { field: 'descricao', headerName: t('description'), width: 150 }
  ];

  const columnsCotacoes = [
    { field: 'nomeProduto', headerName: t('productName'), width: 200 },
    { field: 'fornecedor', headerName: t('supplierName'), width: 200 },
    { field: 'precoUnitario', headerName: t('unitPrice'), width: 150 },
    { field: 'observacoes', headerName: t('observations'), width: 200 },
    {
      field: 'actions',
      headerName: t('actions'),
      width: 150,
      renderCell: (params) => (
        <Button variant="contained" color="error" onClick={() => handleExcluirCotacao(params.row.id)}>
          {t('delete')}
        </Button>
      ),
    },
  ];

  return (
    <>
      <NavbarComponent buttons={buttons} userEmail={userEmail} />

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '5rem',
        }}
      >
        <Box sx={{ padding: 4, width: '70%' }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            {t('managePurchaseRequisitions')}
          </Typography>

          <DataGrid
            rows={requisicoes}
            columns={columnsRequisicoes}
            pageSize={5}
            loading={loading}
            getRowId={(row) => row.id}
          />
        </Box>

        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              padding: 4,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              width: '60%',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <IconButton
                sx={{ position: 'absolute', top: 10, right: 10 }}
                onClick={handleCloseModal}
            >
                <CloseIcon />
            </IconButton>

            <Typography id="modal-modal-title" variant="h4">
              {t('quoteRequest')}
            </Typography>
            <form onSubmit={handleSubmit(onSubmitCotacao)}>
              <TextField
                {...register('idRequisicao')}
                label={t('requestId')}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
                variant="outlined"
              />

                <TextField
                label={t('searchProduct')}
                fullWidth
                margin="normal"
                value={buscaProduto}
                onChange={(e) => {
                    const newValue = e.target.value;
                    setBuscaProduto(newValue);
                    handleBuscarProduto(newValue); // Realiza a busca em tempo real
                }}
                variant="outlined"
                />

              <Box sx={{ mb: 2 }}>
                <DataGrid
                  rows={produtos}
                  columns={columnsProdutos}
                  pageSize={5}
                  autoHeight
                  onRowClick={(params) => handleSelecionarProduto(params.row)}
                />
              </Box>

              <TextField
                {...register('nomeProduto', { required: t('productNameRequired')})}
                label={t('productName')}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    shrink: !!watch('nomeProduto')
                  }}
                error={!!errors.nomeProduto} helperText={errors.nomeProduto?.message}
              />
              <TextField
                {...register('fornecedor', { required: t('supplierRequired') })}
                label={t('supplierName')}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    shrink: !!watch('fornecedor')
                  }}
                error={!!errors.fornecedor} helperText={errors.fornecedor?.message}
              />
              <TextField
                {...register('precoUnitario', { required: t('unitPriceRequired'), pattern: { value: /^\d+(\.\d{1,2})?$/, message: 'Insira um valor numérico válido' } })}
                label={t('unitPrice')}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    shrink: !!watch('precoUnitario')
                  }}
                error={!!errors.precoUnitario} helperText={errors.precoUnitario?.message}
              />
              <TextField
                {...register('observacoes')}
                label={t('observations')}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                    shrink: !!watch('observacoes')
                  }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="contained" type="submit">
                  {t('addQuote')}
                </Button>
              </Box>
            </form>

            <Typography variant="h6" sx={{ mt: 4 }}>
              {t('addedQuotes')}
            </Typography>
            <DataGrid
              rows={cotações}
              columns={columnsCotacoes}
              pageSize={3}
              autoHeight
              getRowId={(row) => row.id}
            />
          </Box>
        </Modal>
      </Box>
    </>
  );
}
