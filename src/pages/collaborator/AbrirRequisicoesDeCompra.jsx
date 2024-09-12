import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, TextField, Typography } from '@mui/material';
import { getRequisicoesByColaborador, deleteRequisicao } from '../../infra/requisicoes'; // Certifique-se de que addRequisicao está exportado
import { useAuth } from '../../contexts/AuthContext';
import { NavbarComponent } from '../../components';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '../../infra/firebase';
import dayjs from 'dayjs'; // Certifique-se de que dayjs está importado

// eslint-disable-next-line react/prop-types
export default function RequisicoesDeCompra({ buttons }) {
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const [requisicoes, setRequisicoes] = useState([]);
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

  const columns = [
    { field: 'produto', headerName: 'Produto', width: 200 },
    { field: 'observacoes', headerName: 'Observações', width: 250 },
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'dataCotacao',
      headerName: 'Data da Cotação',
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
      headerName: 'Gerenciar Requisições',
      width: 200,
      renderCell: (params) => (
        <Button
          onClick={() => handleDelete(params.row.id)}
          variant="contained"
          color="error"
        >
          Excluir
        </Button>
      ),
    },
  ];

  const onSubmit = async (data) => {
    if (user && user.uid) {
      const novaRequisicao = {
        ...data,
        idDoColaborador: user.uid,
        status: 'Aberto',
        dataCotacao: Timestamp.fromDate(new Date())  // Armazena como Timestamp e com o nome dataCotacao
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
          <Typography variant="h4">Requisições de Compra</Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <TextField
              {...register('produto')}
              label="Nome do Produto"
              fullWidth
              margin="normal"
            />
            <TextField
              {...register('observacoes')}
              label="Campo de Observações"
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Enviar Requisição
            </Button>
          </Box>

          <Box sx={{ height: 400, width: '100%', marginTop: 4 }}>
            <DataGrid rows={requisicoes} columns={columns} pageSize={5} />
          </Box>
        </Box>
      </Box>
    </>
  );
}
