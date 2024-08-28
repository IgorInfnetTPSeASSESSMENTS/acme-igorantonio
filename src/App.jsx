import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider} from './contexts/AuthContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import CollaboratorDashboard from './pages/CollaboratorDashboard';



function App() {
  return (
    <AuthProvider>
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/admin-dashboard"
            element={<ProtectedRoute element={<AdminDashboard />} roleRequired="admin" />}
          />
          <Route
            path="/collaborator-dashboard"
            element={<ProtectedRoute element={<CollaboratorDashboard />} roleRequired="collaborator" />}
          />       
      </Routes>
    </AuthProvider>
  );
}

export default App;
