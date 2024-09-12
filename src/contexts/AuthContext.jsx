import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../infra/firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            if (userDoc.data().isBlocked) {
              setUser(null);
              setRole(null);
              await auth.signOut(); // Desconecta o usuário se estiver bloqueado
              navigate('/login');
              return;
            }

            setUser({
              ...currentUser,
              email: currentUser.email // Inclui o e-mail no estado do usuário
            });
            setRole(userDoc.data().role);

            // Verificar se a página acessada é uma rota específica para o papel do usuário
            const isAdminPage = location.pathname.startsWith('/admin');
            const isCollaboratorPage = location.pathname.startsWith('/collaborator');
            const isHomePage = location.pathname === '/home';
            const isFornecedoresPage = location.pathname === '/fornecedores';
            const isContatosPage = location.pathname.startsWith('/contatos/');
            const isProdutosPage = location.pathname === '/produtos';
            const isCotacoesPage = location.pathname.startsWith('/cotacoes/');
            const isGerenciamentoDeUsuariosPage = location.pathname === '/gerenciamento-de-usuarios';
            const isGerenciarRequisicoesDeCompraPage = location.pathname === '/requisicoes-de-compra';
            const isAbrirRequisicoesDeCompraPage = location.pathname === '/abrir-requisicoes-de-compra';

            if (userDoc.data().role === 'admin') {
              if (!isAdminPage && !isHomePage && !isFornecedoresPage && !isContatosPage && !isProdutosPage && !isCotacoesPage && !isGerenciamentoDeUsuariosPage && !isGerenciarRequisicoesDeCompraPage) {
                // Redireciona para o dashboard do admin se não estiver em uma página específica
                navigate('/admin-dashboard');
              }
            } else if (userDoc.data().role === 'collaborator') {
              if (!isCollaboratorPage && !isHomePage && !isAbrirRequisicoesDeCompraPage) {
                // Redireciona para o dashboard do colaborador se não estiver em uma página específica
                navigate('/collaborator-dashboard');
              }
            }
          } else {
            // Usuário não encontrado
            setUser(null);
            setRole(null);
            if (location.pathname !== '/login') {
              navigate('/login');
            }
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário: ', error);
          setUser(null);
          setRole(null);
          if (location.pathname !== '/login') {
            navigate('/login');
          }
        }
      } else {
        // Nenhum usuário autenticado
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  const logout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout: ', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
