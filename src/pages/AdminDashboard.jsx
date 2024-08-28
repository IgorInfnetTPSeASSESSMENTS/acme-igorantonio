import { LogoutButton } from '../components';
import { useAuth } from '../contexts/AuthContext';

function AdminDashboard() {
  const { user, role } = useAuth();

  if (role !== 'admin') {
    return <p>You do not have access to this section.</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      {/* Adicione aqui o conteúdo específico do dashboard do admin */}
      <LogoutButton></LogoutButton>
    </div>
  );
}

export default AdminDashboard;
