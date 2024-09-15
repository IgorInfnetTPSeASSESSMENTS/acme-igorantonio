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
import GerenciarRequisicoesDeCompra from './pages/admin/GerenciarRequisicoesDeCompra';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import enTranslation from './locales/en.json';
import ptTranslation from './locales/pt.json';

const getStoredLanguage = () => {
  const storedLang = localStorage.getItem('i18nextLng');
  return storedLang ? storedLang : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      pt: { translation: ptTranslation },
    },
    lng: getStoredLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });


function App() {

  const { t } = useTranslation();

  const buttons = [
    { name: t('suppliers'), path: '/fornecedores' },
    { name: t('products'), path: '/produtos' },
    { name: t('userManagement'), path: '/gerenciamento-de-usuarios' },
    { name: t('purchaseRequisitions'), path: '/requisicoes-de-compra' },
  ];
  
  const buttonsForColaborattor = [
    { name: t('purchaseRequisitions'), path: '/abrir-requisicoes-de-compra' },
  ]

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
            <Route path="/requisicoes-de-compra" element={<GerenciarRequisicoesDeCompra buttons={buttons}/>} />
        </Routes>
      </LocalizationProvider>
    </AuthProvider>
  );
}

export default App;
