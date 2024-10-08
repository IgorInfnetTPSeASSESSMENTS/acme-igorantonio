import { signOut } from 'firebase/auth';
import { auth } from '../../infra/firebase.js';
import ButtonComponent from '../Button/index.jsx';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  
  const { t } = useTranslation();

  return (
    
    <ButtonComponent
      onClick={handleLogout}
      variant="contained"
      style={{fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'none'}}
      sx={{ 
        fontWeight: 'bold',
        backgroundColor: '#DE3163', 
        color: 'white',
        '&:hover': {
          backgroundColor: '#C12B54', 
        },        
      }}
    >
      {t('logout')}
    </ButtonComponent>
  );
}

export default LogoutButton;
