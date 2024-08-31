import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider} from './contexts/AuthContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import CollaboratorDashboard from './pages/CollaboratorDashboard';
import Fornecedores from './pages/Fornecedores';
import Contatos from './pages/Contatos';
import Produtos from './pages/Produtos';
import Cotacoes from './pages/Cotacoes';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const buttons = [
  { name: 'Fornecedores', path: '/fornecedores' },
  { name: 'Produtos', path: '/produtos' },
  { name: 'Gerenciar Contas', path: '/gerenciar-contas' },
  { name: 'Gerenciar Requisicoes de compra', path: '/gerenciar-requisicoes-de-compra' },
];



function App() {


  return (
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Routes>
            {/* Login and Signup */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Dashboards */}
            <Route
              path="/admin-dashboard"
              element={<ProtectedRoute element={<AdminDashboard buttons={buttons} />} roleRequired="admin" />}
            />
            <Route
              path="/collaborator-dashboard"
              element={<ProtectedRoute element={<CollaboratorDashboard />} roleRequired="collaborator" />}
            />       

            {/* Pages */}
            <Route path="/fornecedores" element={<Fornecedores buttons={buttons} />} />
            <Route path="/produtos" element={<Produtos buttons={buttons} />} />
            <Route path="/contatos/:fornecedorId" element={<Contatos buttons={buttons} />} />
            <Route path="/cotacoes/:produtoId" element={<Cotacoes buttons={buttons} />} />
        </Routes>
      </LocalizationProvider>
    </AuthProvider>
  );
}

export default App;
