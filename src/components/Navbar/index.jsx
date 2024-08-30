import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Menu, MenuItem, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Importa PropTypes para validação das props
import ButtonComponent from '../Button';
import { Dashboard as DashboardIcon, ArrowDropDown as ArrowDropDownIcon, Person as PersonIcon } from '@mui/icons-material';
import { useState } from 'react';
import LogoutButton from '../LogoutButton';

const NavbarComponent = ({ buttons, userEmail }) => {
  const location = useLocation(); // Obtém o caminho atual
  const navigate = useNavigate(); // Hook para navegação

  // Estados para o menu dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleNavigation = (path) => {
    navigate(path); // Navega para o caminho especificado
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const pathAdmin = '/admin-dashboard'

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        backgroundColor: '#028CFE',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <ButtonComponent
          component={RouterLink}
          to="/admin-dashboard"
          onClick={() => handleNavigation('/admin-dashboard')}
          sx={{
            color: 'white',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textTransform: 'none', 
            textDecoration: location.pathname === pathAdmin ? 'underline' : 'none',
          }}
        >
          <DashboardIcon />
          <Typography variant="button" sx={{ fontWeight: 'bold' }}>Dashboard</Typography>
        </ButtonComponent>
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
      <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
        <ButtonComponent
          onClick={handleClick}
          sx={{
            color: 'white',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textTransform: 'none',
          }}
        >
          <PersonIcon />
          <Typography variant="button" sx={{ fontWeight: 'bold' }}>{userEmail}</Typography>
          <ArrowDropDownIcon />
        </ButtonComponent>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          sx={{
            mt: '18px', 
            ml: '120px', 
            '& .MuiMenuItem-root': {
              minWidth: 200,
              fontWeight: 'bold', 
              display:'flex',
              justifyContent:'center'
            },
          }}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>Settings</MenuItem>
          <MenuItem onClick={handleClose}><LogoutButton></LogoutButton></MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

NavbarComponent.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
  userEmail: PropTypes.string.isRequired, // Adiciona a prop para o e-mail do usuário
};

export default NavbarComponent;
