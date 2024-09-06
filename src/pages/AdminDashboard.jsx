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
    <>
      <NavbarComponent buttons={buttons} userEmail={userEmail}/>
      <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.email}</p>
        <LogoutButton></LogoutButton>
      </Box>
    </>
  );
}

export default AdminDashboard;
