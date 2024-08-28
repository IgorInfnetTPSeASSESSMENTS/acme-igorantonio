import { signOut } from 'firebase/auth';
import { auth } from '../../infra/firebase.js';
import ButtonComponent from '../Button/index.jsx';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");      
    } catch (error) {
      console.error('Erro ao deslogar: ', error);
    }
  };

  return (
    <ButtonComponent onClick={handleLogout} variant="contained" color="secondary">
      Logout
    </ButtonComponent>
  );
}

export default LogoutButton;
