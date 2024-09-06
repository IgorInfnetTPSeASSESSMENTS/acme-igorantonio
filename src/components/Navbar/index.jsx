import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Menu, MenuItem, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ButtonComponent from '../Button';
import { Dashboard as DashboardIcon, ArrowDropDown as ArrowDropDownIcon, Person as PersonIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useState } from 'react';
import LogoutButton from '../LogoutButton';

const NavbarComponent = ({ buttons, userEmail }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Estados para o menu dropdown e a barra lateral
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const open = Boolean(anchorEl);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const pathAdmin = '/admin-dashboard';

  return (
    <>
      {/* Barra Lateral */}
      <Box
        sx={{
          width: isSidebarOpen ? '10rem' : '1rem', // Ajusta a largura com base no estado
          transition: 'width 0.3s',
          backgroundColor: '#028CFE',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: 2,
          color: 'white',
          overflow: 'hidden',
          boxShadow: isSidebarOpen ? '2px 0 5px rgba(0,0,0,0.5)' : 'none',
          zIndex: 3,
        }}
      >
        <Box
          onClick={handleSidebarToggle}
          sx={{ 
            color: 'white', 
            border: 'none', 
            display: 'flex', 
            justifyContent: 'center', 
            height: '40px', 
            marginBottom: 2, 
            cursor: 'pointer' 
          }}
        >   
          <MenuIcon sx={{ fontSize: '40px' }} />
        </Box>

        {isSidebarOpen && (
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ButtonComponent
              component={RouterLink}
              to="/admin-dashboard"
              onClick={() => handleNavigation('/admin-dashboard')}
              sx={{
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textTransform: 'none',
                backgroundColor: location.pathname === pathAdmin ? 'white' : '#028CFE',
                color: location.pathname === pathAdmin ? '#028CFE' : 'white',
                "&.MuiButtonBase-root:hover": {
                  bgcolor: 'white',
                  color: '#028CFE',
                },
                justifyContent: 'center',
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
                  fontWeight: 'bold',
                  backgroundColor: location.pathname === path ? 'white' : '#028CFE',
                  color: location.pathname === path ? '#028CFE' : 'white',
                  "&.MuiButtonBase-root:hover": {
                    bgcolor: 'white',
                    color: '#028CFE',
                  },
                  justifyContent: 'center',
                  textAlign: 'center'
                }}
              >
                {name}
              </ButtonComponent>
            ))}
          </Box>
        )}
      </Box>

      {/* Conteúdo Principal e Menu Dropdown */}
      <Box
        sx={{
          marginLeft: isSidebarOpen ? '9rem' : '3rem', // Mantém o conteúdo no lugar sem arredar
          transition: 'margin-left 0.3s',
          paddingTop: '1rem',
          paddingRight: '1rem',
          display: 'flex',
          justifyContent: 'flex-end', // Garante que o nome do usuário não arreda
          alignItems: 'center',
          zIndex: 2, // Define o zIndex para evitar que sobreponha a barra lateral
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#028CFE', padding: '0.5rem 1rem', borderRadius: '8px'}}>
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
              ml: 'auto',
              marginLeft: '3.8%',
              '& .MuiMenuItem-root': {
                minWidth: 200,
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
              },
            }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleClose}><LogoutButton /></MenuItem>
          </Menu>
        </Box>
      </Box>
    </>
  );
};

NavbarComponent.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
  userEmail: PropTypes.string.isRequired,
};

export default NavbarComponent;
