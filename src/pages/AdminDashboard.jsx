import { Box } from '@mui/material';
import { LogoutButton, NavbarComponent } from '../components';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/images/logo.png'
function AdminDashboard() {
  const { user, role } = useAuth();

  if (role !== 'admin') {
    return <p>You do not have access to this section.</p>;
  }

  const buttons = [
    { name: 'Home', path: '/home' },
    { name: 'Fornecedores', path: '/fornecedores' },
    { name: 'Contatos', path: '/contatos' },
    { name: 'Produtos', path: '/produtos' },
    { name: 'Cotacoes', path: '/cotacoes' },
  ];

  return (
    <Box sx={{
      height: '100%',
      width: '100%'
    }}>
      <NavbarComponent buttons={buttons} />
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      {/* Adicione aqui o conteúdo específico do dashboard do admin */}
      <LogoutButton></LogoutButton>
    </Box>
  );
}

export default AdminDashboard;
