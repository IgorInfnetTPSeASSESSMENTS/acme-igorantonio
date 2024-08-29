import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Importa PropTypes para validação das props
import ButtonComponent from '../Button';

const NavbarComponent = ({ buttons }) => {
  const location = useLocation(); // Obtém o caminho atual
  const navigate = useNavigate(); // Hook para navegação

  const handleNavigation = (path) => {
    navigate(path); // Navega para o caminho especificado
  };

  return (
    <>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        backgroundColor: '#028CFE',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
        {buttons.map(({ name, path }) => (
          <ButtonComponent
            key={path}
            component={RouterLink}
            to={path}
            onClick={() => handleNavigation(path)}
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textDecoration: location.pathname === path ? 'underline' : 'none',
            }}
          >
            {name}
          </ButtonComponent>
        ))}
      </Box>
    </Box>
    </>
  );
};

NavbarComponent.propTypes = {
  logo: PropTypes.string.isRequired,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default NavbarComponent;
