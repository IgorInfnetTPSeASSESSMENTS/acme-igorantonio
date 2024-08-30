import { Box } from '@mui/material';
import { LogoutButton, NavbarComponent } from '../components';
import { useAuth } from '../contexts/AuthContext';

// eslint-disable-next-line react/prop-types
function AdminDashboard({buttons}) {
  const { user, role } = useAuth();

  if (role !== 'admin') {
    return <p>You do not have access to this section.</p>;
  }

  const userEmail = user ? user.email : '';

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
