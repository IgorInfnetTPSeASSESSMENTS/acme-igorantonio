import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../infra/firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const navigate = useNavigate();

  const resetSessionExpiry = () => {
    const expiryTime = new Date().getTime() + 3600000; // 1 hora
    setSessionExpiry(expiryTime);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        setRole(userDoc.data().role);

        // Configura o tempo de expiração da sessão
        resetSessionExpiry();
      } else {
        setUser(null);
        setRole(null);
      }
    });

    // Verifica a expiração da sessão a cada 5 minutos
    const interval = setInterval(() => {
      if (sessionExpiry && new Date().getTime() > sessionExpiry) {
        setUser(null);
        setRole(null);
        signOut(auth).then(() => {
          navigate('/login'); // Redireciona para a página de login após o logout
        }).catch((error) => {
          console.error("Error signing out: ", error);
        });
      }
    }, 300000); // 5 minutos

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [sessionExpiry, navigate]);

  useEffect(() => {
    // Redireciona o usuário após o papel ser carregado
    if (user && role) {
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'collaborator') {
        navigate('/collaborator-dashboard');
      } else {
        navigate('/nao-encontrado');
      }
    }
  }, [user, role, navigate]);

  return (
    <AuthContext.Provider value={{ user, role, resetSessionExpiry }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
