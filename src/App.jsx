import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider} from './contexts/AuthContext';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import Fornecedores from './pages/admin/Fornecedores';
import Contatos from './pages/admin/Contatos';
import Produtos from './pages/admin/Produtos';
import Cotacoes from './pages/admin/Cotacoes';
import GerenciamentoDeUsuarios from './pages/admin/GerenciamentoDeUsuarios';
import CollaboratorDashboard from './pages/collaborator/CollaboratorDashboard';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AbrirRequisicoesDeCompra from './pages/collaborator/AbrirRequisicoesDeCompra';


const buttons = [
  { name: 'Fornecedores', path: '/fornecedores' },
  { name: 'Produtos', path: '/produtos' },
  { name: 'Gerenciamento de usuários', path: '/gerenciamento-de-usuarios' },
  { name: 'Requisições de compra', path: '/requisicoes-de-compra' },
];

const buttonsForColaborattor = [
  { name: 'Requisições de compra', path: '/abrir-requisicoes-de-compra' },
]


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
              element={<ProtectedRoute element={<CollaboratorDashboard buttons={buttonsForColaborattor}/>} roleRequired="collaborator" />}
            />       

            {/* Pages */}
            <Route path="/fornecedores" element={<Fornecedores buttons={buttons} />} />
            <Route path="/produtos" element={<Produtos buttons={buttons} />} />
            <Route path="/contatos/:fornecedorId" element={<Contatos buttons={buttons} />} />
            <Route path="/cotacoes/:produtoId" element={<Cotacoes buttons={buttons} />} />
            <Route path="/gerenciamento-de-usuarios" element={<GerenciamentoDeUsuarios buttons={buttons} />} />
            <Route path="/abrir-requisicoes-de-compra" element={<AbrirRequisicoesDeCompra buttons={buttonsForColaborattor}/>} />
        </Routes>
      </LocalizationProvider>
    </AuthProvider>
  );
}

export default App;
