import { LogoutButton } from '../components';
import { useAuth } from '../contexts/AuthContext';

function CollaboratorDashboard() {
  const { user, role } = useAuth();

  if (role !== 'collaborator') {
    return <p>You do not have access to this section.</p>;
  }

  return (
    <div>
      <h1>Collaborator Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      <LogoutButton></LogoutButton>
    </div>
  );
}

export default CollaboratorDashboard;


