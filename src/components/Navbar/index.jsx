import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ButtonComponent from '../Button';
import { Dashboard as DashboardIcon, Menu as MenuIcon } from '@mui/icons-material';
import FactoryIcon from '@mui/icons-material/Factory';
import CategoryIcon from '@mui/icons-material/Category';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';
import LogoutButton from '../LogoutButton';

const NavbarComponent = ({ buttons, userEmail }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Estados para o menu dropdown e a barra lateral
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLeftSidebarToggle = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  const handleRightSidebarToggle = () => {
    setIsRightSidebarOpen(!isRightSidebarOpen);
  };

  const pathAdmin = '/admin-dashboard';
  const pathFornecedores = '/fornecedores';
  const pathProdutos = '/produtos';
  const pathGerenciamento = '/gerenciamento-de-usuarios';
  const pathRequisicoes = '/requisicoes-de-compra';


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
      {/* Barra Lateral Esquerda*/}
      <Box
        sx={{
          width: isLeftSidebarOpen ? '15rem' : '0px', // Ajusta a largura com base no estado
          transition: 'width 0.3s',
          height: '100vh',
          position: 'fixed',
          paddingTop: isLeftSidebarOpen ? 2 : 2,
          paddingLeft: isLeftSidebarOpen ? 2 : 0,
          paddingRight: isLeftSidebarOpen ? 2 : 0,
          paddingBottom: isLeftSidebarOpen ? 2 : 0,
          left: 0,
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          color: 'white',
          backgroundColor: 'white',
          boxShadow: isLeftSidebarOpen ? '2px 0 5px rgba(0,0,0,0.5)' : 'none',
          zIndex: 2,
          borderRadius: '0 20px 20px 0',
        }}
      >
        {isLeftSidebarOpen && (


          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box
              onClick={handleLeftSidebarToggle}
              sx={{ 
                color: 'white', 
                border: 'none',  
                height: '40px',  
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
                cursor: 'pointer'
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
                  width: isLeftSidebarOpen ? '100%' : 'auto',
                  whiteSpace: isLeftSidebarOpen ? 'nowrap' : 'nowrap',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
              >
                {getIcon(name)}
                {name}
              </ButtonComponent>
            ))}
          </Box>
        )}
      </Box>

      {/* Menu Principal */}
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

        
        }}>
          <Box
            onClick={handleLeftSidebarToggle}
            sx={{ 
              marginLeft: '1rem',
              justifyContent: 'center',
              color: 'white', 
              border: 'none', 
              display: 'flex',  
              marginBottom: 2, 
              cursor: 'pointer',
            }}
          >   
            <MenuIcon sx={{ fontSize: '38px', marginTop: '0.1rem' }} />
          </Box>
        </Box>


        <Box sx={{ display: 'flex', alignItems: 'center', position: 'absolute', right: '1%'}}>
          <ButtonComponent
            onClick={handleRightSidebarToggle}
            sx={{
              color: 'white',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textTransform: 'none',
              padding: 0
            }}
          >
                <Box sx={{ 
              backgroundImage: `url(src/assets/images/admin.jpg)`, 
              width: '45px', 
              height: '45px', 
              backgroundSize: 'cover', 
              backgroundPosition: 'center', 
              backgroundRepeat: 'no-repeat',
              borderRadius: '50%', }} />

          </ButtonComponent>
        </Box>
      </Box>

      {/* Barra lateral direita */}

      <Box sx={{
          width: isRightSidebarOpen ? '15rem' : '0px', // Ajusta a largura com base no estado
          transition: 'width 0.3s',
          height: '100vh',
          position: 'fixed',
          paddingTop: isRightSidebarOpen ? 2 : 2,
          paddingLeft: isRightSidebarOpen ? 2 : 0,
          paddingRight: isRightSidebarOpen ? 2 : 0,
          paddingBottom: isRightSidebarOpen ? 2 : 0,
          right: 0,
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          boxShadow: isRightSidebarOpen ? '2px 0 5px rgba(0,0,0,0.5)' : 'none',
          zIndex: 2,
          borderRadius: '20px 0px 0px 20px',
        }}
      >
        {isRightSidebarOpen && (
          <Box 
          sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
          >
           <Box
              sx={{ 
                border: 'none',    
                marginBottom: '1.2rem',
                marginLeft: '0rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>  
                <Box sx={{
                  display: 'flex', 
                  flexDirection: 'row',
                  marginBottom: '2.4rem'  
                  }}
                  >
                  <Box sx={{ 
                    backgroundImage: `url(src/assets/images/admin.jpg)`, 
                    width: '50px', 
                    height: '50px', 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center', 
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '50%',
                    }} 
                  />                  
                  <Box sx={{paddingTop: '0.7rem', marginLeft: '0.7rem', textAlign: 'center'}}>
                      <Typography sx={{fontSize: '0.75rem', color: '#2E3B4E', fontWeight: 'bold'}}>Logged in as:</Typography>
                      <Typography sx={{textDecoration: 'underline', fontSize: '0.75rem', color: '#2E3B4E', fontWeight: 'bold'}}>{userEmail}</Typography>
                  </Box>
                </Box>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  width: isRightSidebarOpen ? '100%' : 'auto',
                  whiteSpace: isRightSidebarOpen ? 'nowrap' : 'nowrap',
                  overflow: 'hidden',
                  gap: 2,
                  cursor: 'pointer'
                }}>
                    <ButtonComponent sx={{
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        backgroundColor: location.pathname === pathAdmin || pathFornecedores || pathProdutos || pathGerenciamento || pathRequisicoes ? 'white' : '#2E3B4E',
                        color: location.pathname === pathAdmin || pathFornecedores || pathProdutos || pathGerenciamento || pathRequisicoes ? '#2E3B4E' : 'white',
                        "&.MuiButtonBase-root:hover": {
                          bgcolor: '#2E3B4E',
                          color: 'white',
                        },
                        gap: 1,
                        padding: '0',
                        }}>
                      <AccountCircleIcon sx={{fontSize: '1rem'}}></AccountCircleIcon>
                      <Typography sx={{
                        fontWeight: 'bold',  
                        fontSize: '0.875rem',
                        lineHeight: 1.2,
                        textTransform: 'none',
                        padding: '0'
                        }}
                        >
                          Perfil
                        </Typography>
                    </ButtonComponent>
                    <ButtonComponent sx={{
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        backgroundColor: location.pathname === pathAdmin || pathFornecedores || pathProdutos || pathGerenciamento || pathRequisicoes ? 'white' : '#2E3B4E',
                        color: location.pathname === pathAdmin || pathFornecedores || pathProdutos || pathGerenciamento || pathRequisicoes ? '#2E3B4E' : 'white',
                        "&.MuiButtonBase-root:hover": {
                          bgcolor: '#2E3B4E',
                          color: 'white',
                        },
                        gap: 1,
                        padding: '0'
                        }}>
                      <SettingsIcon sx={{fontSize: '1rem'}}></SettingsIcon>
                      <Typography sx={{
                        fontWeight: 'bold',  
                        fontSize: '0.875rem',
                        lineHeight: 1.2,
                        textTransform: 'none',
                        }}>
                          Configurações
                        </Typography>
                    </ButtonComponent>
                    <LogoutButton></LogoutButton>
              </Box>           
            </Box>           
          </Box>)}            
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
