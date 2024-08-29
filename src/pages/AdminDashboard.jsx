import { Box } from '@mui/material';
import { LogoutButton, NavbarComponent } from '../components';
import { useAuth } from '../contexts/AuthContext';

function AdminDashboard() {
  const { user, role } = useAuth();

  if (role !== 'admin') {
    return <p>You do not have access to this section.</p>;
  }

  const userEmail = user ? user.email : '';


  const buttons = [
    { name: 'Fornecedores', path: '/fornecedores' },
    { name: 'Contatos', path: '/contatos' },
    { name: 'Produtos', path: '/produtos' },
    { name: 'Cotacoes', path: '/cotacoes' },
    { name: 'Gerenciar Contas', path: '/gerenciar-contas' },
    { name: 'Gerenciar Requisicoes de compra', path: '/gerenciar-requisicoes-de-compra' },
  ];

  return (
    <Box sx={{
      height: '100%',
      width: '100%'
    }}>
      <NavbarComponent buttons={buttons} userEmail={userEmail}/>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      <LogoutButton></LogoutButton>
    </Box>
  );
}

export default AdminDashboard;
