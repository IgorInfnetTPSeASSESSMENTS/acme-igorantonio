import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Switch, Typography } from '@mui/material';
import { fetchUsers, toggleUserBlock } from '../../infra/usuarios'; // Importe as funções do arquivo usuarios.js
import { NavbarComponent } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line react/prop-types
export default function GerenciamentoDeUsuarios({buttons}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { t } = useTranslation();
  const userEmail = user ? user.email : '';

  useEffect(() => {
    const unsubscribe = fetchUsers((data) => {
      setRows(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleToggle = async (id, isBlocked) => {
    await toggleUserBlock(id, isBlocked);
  };

  const columns = [
    { field: 'email', headerName: 'E-mail', width: 250 },
    { field: 'role', headerName: t('role'), width: 150 },
    {
      field: 'isBlocked',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Switch
          checked={Boolean(params.value)}
          onChange={() => handleToggle(params.row.id, params.value)}
        />
      ),
    },
  ];

  

  return (
    <>
        <NavbarComponent buttons={buttons} userEmail={userEmail}></NavbarComponent>
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: '5rem'}}>
            <Box sx={{ padding: 4, width: '70%'}}>
            <Typography variant="h4" gutterBottom sx={{ marginBottom: 3}}>{t('userManagement')}</Typography>
                <Box style={{ marginTop: 2, height: 400 }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        loading={loading}
                    />
                </Box>
            </Box>
        </Box>
    </>
  );
}
