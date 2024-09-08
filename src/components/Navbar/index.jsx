import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Menu, MenuItem, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ButtonComponent from '../Button';
import { Dashboard as DashboardIcon, ArrowDropDown as ArrowDropDownIcon, Person as PersonIcon, Menu as MenuIcon } from '@mui/icons-material';
import FactoryIcon from '@mui/icons-material/Factory';
import CategoryIcon from '@mui/icons-material/Category';
import GroupsIcon from '@mui/icons-material/Groups';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
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

  const getIcon = (name) => {
    switch (name) {
      case 'Fornecedores':
        return <FactoryIcon sx={{fontSize: '1rem'}}/>;
      case 'Produtos':
        return <CategoryIcon sx={{fontSize: '1rem'}}/>;
      case 'Gerenciamento de usuários':
        return <GroupsIcon sx={{fontSize: '1rem'}}/>;
      case 'Requisições de compra':
        return <RequestQuoteIcon sx={{fontSize: '1rem'}}/>;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Barra Lateral */}
      <Box
        sx={{
          width: isSidebarOpen ? '15rem' : '0px', // Ajusta a largura com base no estado
          transition: 'width 0.3s',
          height: '100vh',
          position: 'fixed',
          paddingTop: isSidebarOpen ? 2 : 2,
          paddingLeft: isSidebarOpen ? 2 : 0,
          paddingRight: isSidebarOpen ? 2 : 0,
          paddingBottom: isSidebarOpen ? 2 : 0,
          left: 0,
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          backgroundColor: 'white',
          boxShadow: isSidebarOpen ? '2px 0 5px rgba(0,0,0,0.5)' : 'none',
          zIndex: 2,
          borderRadius: '0 20px 20px 0',
        }}
      >
        {isSidebarOpen && (


          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box
              onClick={handleSidebarToggle}
              sx={{ 
                color: 'white', 
                border: 'none',  
                height: '40px',  
                cursor: 'pointer',
                marginBottom: '1.2rem',
                marginLeft: '0rem'
              }}
            >   
              <Box sx={{ backgroundImage: `url(src/assets/images/logoRounded.png)`, width: '50px', height: '50px', backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat', }} />
            </Box>


            <ButtonComponent
              component={RouterLink}
              to="/admin-dashboard"
              onClick={() => handleNavigation('/admin-dashboard')}
              sx={{
                fontWeight: 'bold',
                lineHeight: 0,
                gap: 1,
                backgroundColor: location.pathname === pathAdmin ? '#028CFE' : 'white',
                color: location.pathname === pathAdmin ? 'white' : '#028CFE',
                "&.MuiButtonBase-root:hover": {
                  bgcolor: '#028CFE',
                  color: 'white',
                },
                justifyContent: 'flex-start',
                textAlign: 'left',
              }}
            >
              <DashboardIcon sx={{fontSize: '1rem'}}/>
              <Typography variant="button" sx={{ fontWeight: 'bold', textTransform: 'none', lineHeight: 0 }}>Dashboard</Typography>
            </ButtonComponent>
            {buttons.map(({ name, path }) => (
              <ButtonComponent
                key={path}
                component={RouterLink}
                to={path}
                onClick={() => handleNavigation(path)}
                sx={{
                  textTransform: 'none',
                  lineHeight: 1.2,
                  fontWeight: 'bold',
                  backgroundColor: location.pathname === path ? '#028CFE' : 'white',
                  color: location.pathname === path ? 'white' : '#028CFE',
                  "&.MuiButtonBase-root:hover": {
                    bgcolor: '#028CFE',
                    color: 'white',
                  },
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1, // Espaço entre ícone e texto
                  width: isSidebarOpen ? '100%' : 'auto',
                  whiteSpace: isSidebarOpen ? 'nowrap' : 'nowrap',
                  overflow: 'hidden', 
                }}
              >
                {getIcon(name)}
                {name}
              </ButtonComponent>
            ))}
          </Box>
        )}
      </Box>

      {/* Conteúdo Principal e Menu Dropdown */}
      <Box
        sx={{
          transition: 'margin-left 0.3s',
          paddingTop: '1rem', 
          width: '100%', 
          display: 'flex', // Garante que o nome do usuário não arreda
          backgroundColor: '#028CFE',
          height: '5.9vh',
          position: 'absolute',
          zIndex: 1,
        }}
      >
        <Box sx={{

        //Ícone Menu
        }}>
          <Box
            onClick={handleSidebarToggle}
            sx={{ 
              marginLeft: '1rem',
              justifyContent: 'center',
              color: 'white', 
              border: 'none', 
              display: 'flex',  
              height: '40px', 
              marginBottom: 2, 
              cursor: 'pointer',
            }}
          >   
            <MenuIcon sx={{ fontSize: '38px', marginTop: '0.1rem' }} />
          </Box>
        </Box>


        <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#028CFE', padding: '0.5rem 1rem', borderRadius: '8px', position: 'absolute', right: '13%'}}>
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
