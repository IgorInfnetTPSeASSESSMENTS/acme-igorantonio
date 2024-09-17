import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, TextField, Typography, Modal } from '@mui/material';
import { getRequisicoesByColaborador, deleteRequisicao } from '../../infra/requisicoes';
import { useAuth } from '../../contexts/AuthContext';
import { NavbarComponent } from '../../components';
import { addDoc, collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../infra/firebase';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { CSVLink } from "react-csv";

// eslint-disable-next-line react/prop-types
export default function RequisicoesDeCompra({ buttons }) {
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const [requisicoes, setRequisicoes] = useState([]);
  const [cotacoes, setCotacoes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRequisicaoId, setSelectedRequisicaoId] = useState(null);
  const { t } = useTranslation();
  const userEmail = user ? user.email : '';

  useEffect(() => {
    const fetchRequisicoes = async () => {
      if (user && user.uid) {
        const requisicoesData = await getRequisicoesByColaborador(user.uid);
        setRequisicoes(requisicoesData);
      }
    };

    fetchRequisicoes();
  }, [user]);

  const handleDelete = async (id) => {
    await deleteRequisicao(id);
    setRequisicoes(requisicoes.filter((req) => req.id !== id));
  };

  const handleViewCotacoes = async (requisicaoId) => {
    setSelectedRequisicaoId(requisicaoId);
    const cotacoesRef = collection(db, 'requisicoes', requisicaoId, 'cotacoes');
    const cotacoesSnapshot = await getDocs(cotacoesRef);
    const cotacoesData = cotacoesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCotacoes(cotacoesData);
    setOpenModal(true);
  };

  const columns = [
    { field: 'produto', headerName: t('productName'), width: 200 },
    { field: 'observacoes', headerName: t('observationsField'), width: 250 },
    { field: 'status', headerName: t('Status'), width: 150 },
    {
      field: 'dataCotacao',
      headerName: t('requisitionDate'),
      width: 200,
      renderCell: (params) => {
        const dataCotacao = params.value;
        const formattedDate = dataCotacao
          ? (dataCotacao instanceof Timestamp ? dayjs(dataCotacao.toDate()).format('DD/MM/YYYY HH:mm:ss') : dayjs(dataCotacao).format('DD/MM/YYYY HH:mm:ss'))
          : 'N/A';
        return <span>{formattedDate}</span>;
      },
    },
    {
      field: 'delete',
      headerName: t('manageRequisitions'),
      width: 200,
      renderCell: (params) => (
        <Button
          onClick={() => handleDelete(params.row.id)}
          variant="contained"
          color="error"
        >
          {t('delete')}
        </Button>
      ),
    },
    {
      field: 'viewCotacoes',
      headerName: t('viewQuotes'),
      width: 200,
      renderCell: (params) => (
        <Button
          onClick={() => handleViewCotacoes(params.row.id)}
          variant="contained"
          color="primary"
          disabled={params.row.status !== 'Quoted' && params.row.status !== 'Cotada'}
        >
          {t('view')}
        </Button>
      ),
    },
  ];

  const cotacoesColumns = [
    { field: 'fornecedor', headerName: t('supplierName'), width: 200 },
    { field: 'nomeProduto', headerName: t('productName'), width: 200 },
    { field: 'observacoes', headerName: t('observationsField'), width: 250 },
    { field: 'precoUnitario', headerName: t('unitPrice'), width: 150 },
  ];

  const onSubmit = async (data) => {
    if (user && user.uid) {
      const novaRequisicao = {
        ...data,
        idDoColaborador: user.uid,
        status: 'Aberto',
        dataCotacao: Timestamp.fromDate(new Date())
      };

      try {
        await addDoc(collection(db, 'requisicoes'), novaRequisicao);
        const requisicoesData = await getRequisicoesByColaborador(user.uid);
        setRequisicoes(requisicoesData);
        reset();
      } catch (error) {
        console.error('Erro ao adicionar requisição: ', error);
      }
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCotacoes([]);
  };

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
          <Typography variant="h4">{t('purchaseRequisitions')}</Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <TextField
              {...register('produto')}
              label={t('productName')}
              fullWidth
              margin="normal"
            />
            <TextField
              {...register('observacoes')}
              label={t('observationsField')}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              {t('sendRequisition')}
            </Button>
          </Box>

          <Box sx={{ height: 400, width: '100%', marginTop: 4 }}>
            <DataGrid rows={requisicoes} columns={columns} pageSize={5} />
          </Box>
        </Box>
      </Box>

      {/* Modal to display cotacoes */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', p: 4 }}>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            {t('viewQuotes')}
          </Typography>
          <Box sx={{ height: 300, width: '100%' }}>
            <DataGrid rows={cotacoes} columns={cotacoesColumns} pageSize={5} />
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => console.log("Exportar CSV")}
          >
            <CSVLink data={cotacoes} filename={`cotacoes_${selectedRequisicaoId}.csv`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {t('exportCSV')}
            </CSVLink>
          </Button>
        </Box>
      </Modal>
    </>
  );
}
