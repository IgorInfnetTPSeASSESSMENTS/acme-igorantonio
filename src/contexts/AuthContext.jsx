import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../infra/firebase";
import { doc, getDoc } from "firebase/firestore";


// Cria o contexto de autenticação
const AuthContext = createContext();

// Componente provedor de autenticação
// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true); // Indica que está carregando
      console.log("onAuthStateChanged")

      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUser(currentUser);
            setRole(userDoc.data().role);
            navigateToDashboard(userDoc.data().role); // Navega para o dashboard apropriado
          } else {
            // Usuário não encontrado na coleção 'users'
            setUser(null);
            setRole(null);
            navigate('/login'); // Redireciona para o login se o usuário não for encontrado
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário: ', error);
          setUser(null);
          setRole(null);
          navigate('/login'); // Redireciona para o login em caso de erro
        }
      } else {
        setUser(null);
        setRole(null);
        navigate('/login'); // Redireciona para o login se não houver usuário autenticado
      }

      setLoading(false); // Carregamento concluído
    });

    return () => unsubscribe();
  }, [navigate]);

  const navigateToDashboard = (userRole) => {
    if (userRole === 'admin') {
      navigate('/admin-dashboard');
    } else if (userRole === 'collaborator') {
      navigate('/collaborator-dashboard');
    } else {
      navigate('/login'); // Redireciona para o login se o papel não for reconhecido
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      navigate('/login'); // Redireciona para o login após o logout
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

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
