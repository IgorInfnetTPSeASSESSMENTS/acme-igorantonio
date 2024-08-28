import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../infra/firebase.js';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import { ButtonComponent, TextFieldComponent, TypographyComponent, VideoComponent } from '../components/index.jsx';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { keyframes } from '@mui/system';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Redirecionar para a página inicial após cadastro
    } catch (error) {
      console.error("Error signing up: ", error);
    }
  };

  const slideInFromLeft = keyframes`
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

  return (
    <Box
      className="MainContainer"
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSignUp();
      }}
      sx={{
        display: 'flex',
        alignItems: 'center', 
        position: 'absolute',
        overflow: 'hidden',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Box 
      className="LeftContainer" 
      sx={{
        height:'100%',
        width:'43%',
        display:'flex' ,
        alignItems:'center',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor:'#028CFE',
        zIndex: '1',
        '@media (max-width: 1500px)': {
      width: '100%',
      height: '100%',
    }
        }}
        >
        <VideoComponent sxPersonalized={{
          position: 'absolute',
          height: '100%',
          width: '40%',
          overflow: 'hidden',
          top: 0,
          left: '0',
          zIndex: '0',
          '@media (max-width: 1600px)': {
            position: 'absolute',
            height:'100%',
            zIndex: '0',
    }, '@media (max-width: 1500px)': {
            display: 'none'
    }
          
        }}

        />
        <Box 
        className="Logo"
        sx={{
          height:'150px',
          width:'150px',
          position: 'absolute',
          top: 0,
          right: '2%',
          backgroundImage: `url(src/assets/images/logo.png)`, // Caminho para a ilustração
          backgroundSize: 'cover', // Faz a imagem cobrir todo o contêiner
          backgroundPosition: 'center', // Centraliza a imagem no contêiner
          backgroundRepeat: 'no-repeat', // Evita que a imagem se repita
          zIndex:'1',
          animation: 'slideDown 1s ease-out forwards', // Define a animação
          '@keyframes slideDown': {
            '0%': {
              top: '-200px', // Começa fora da tela
            },
            '100%': {
              top: '0', // Termina na posição desejada
            },
    }
        }}>
        </Box>
        <Box 
        className="FormContainer"
        sx={{ 
          maxWidth: 400,
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '30%',
          zIndex: '0',
          animation: `${slideInFromLeft} 1s ease-out`   
          }}
          >
          <TypographyComponent variant="h4" color='white' sx={{ mb: 4, textAlign: 'center', zIndex: '0'}}>
            Cadastre sua conta
          </TypographyComponent>
          <TextFieldComponent
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            color='warning'
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white', // Cor do outline
                },
                '&:hover fieldset': {
                  borderColor: 'lightgray', // Cor do outline ao passar o mouse
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white', // Cor do outline ao focar no campo
                },
              },
              '& .MuiInputLabel-root': {
                color: 'white', // Cor do label (placeholder)
              },
              '& .MuiInputBase-input': {
                color: 'white', // Cor do texto digitado
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white', // Cor do outline quando o campo não está focado
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white', // Cor do label quando o campo está focado
              },
              '& .MuiInputLabel-root.Mui-focused + .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white', // Cor do outline quando o label está focado
              }, 
            }}
          />
          <TextFieldComponent
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white', // Cor do outline
                },
                '&:hover fieldset': {
                  borderColor: 'lightgray', // Cor do outline ao passar o mouse
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white', // Cor do outline ao focar no campo
                },
              },
              '& .MuiInputLabel-root': {
                color: 'white', // Cor do label (placeholder)
              },
              '& .MuiInputBase-input': {
                color: 'white', // Cor do texto digitado
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white', // Cor do outline quando o campo não está focado
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white', // Cor do label quando o campo está focado
              },
              '& .MuiInputLabel-root.Mui-focused + .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white', // Cor do outline quando o label está focado
              },
            }}
          />
          <ButtonComponent type="submit" variant="contained" startIcon={<PersonAddAltIcon sx={{ color: (theme) => theme.palette.primary.main }} />} // Cor do ícone usando a cor primária
  sx={{
    mt: 2,
    height: '6vh',
    backgroundColor: 'white', // Cor de fundo do botão
    color: (theme) => theme.palette.primary.main, // Cor do texto do botão usando a cor primária
    '&:hover': {
      backgroundColor: '#D3D3D3', // Cor de fundo ao passar o mouse
      color: (theme) => theme.palette.primary.main, // Cor do texto ao passar o mouse
    },
  }}>
            Criar Conta
          </ButtonComponent>
          <TypographyComponent variant="body2" sx={{ mt: 2, textAlign: 'center', color:'lightgray'}}>
            Já tem uma conta?{' '}
            <Link component={RouterLink} to="/login" 
            sx={{ 
              fontWeight: 'bold',
              color: 'white',
              zIndex: '2',
              '&:hover': {
      color: 'lightgray', 
    } 
              }} 
              >
              Faça login clicando aqui
            </Link>
          </TypographyComponent>
        </Box>
      </Box>

      <Box
        className="IllustrationContainer"
        sx={{
          display: 'flex',
          width: '57%',
          height: '100%',
          backgroundImage: `url(src/assets/images/illustration.jpg)`, // Caminho para a ilustração
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          '@media (max-width: 1500px)': {
          display: 'none'
    }
        }}
      />
    </Box>
  );
}

export default SignUp;
