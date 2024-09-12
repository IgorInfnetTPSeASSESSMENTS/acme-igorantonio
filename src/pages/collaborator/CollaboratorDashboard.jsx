import { Box } from '@mui/material';
import { NavbarComponent } from '../../components';
import { useAuth } from '../../contexts/AuthContext';

// eslint-disable-next-line react/prop-types
function CollaboratorDashboard({buttons}) {
  const { user, role } = useAuth();

  if (role !== 'collaborator') {
    return <p>You do not have access to this section.</p>;
  }

  const userEmail = user ? user.email : '';


  return (
    <>
        <NavbarComponent buttons={buttons} userEmail={userEmail}></NavbarComponent>
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: '5rem'}}>
            <Box sx={{ padding: 4, width: '70%'}}>
            <h1>Collaborator Dashboard</h1>
            <p>Welcome, {user?.email}</p>
            </Box>
        </Box>
    </>
  );
}

export default CollaboratorDashboard;


