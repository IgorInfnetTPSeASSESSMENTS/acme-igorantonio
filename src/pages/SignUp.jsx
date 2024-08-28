import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../infra/firebase.js';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import { ButtonComponent, TextFieldComponent, TypographyComponent, VideoComponent } from '../components/index.jsx';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { keyframes } from '@mui/system';
import { doc, setDoc } from 'firebase/firestore';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "collaborator"
      });
  
      navigate('/dashboard');
    } catch (error) {
      const errorCode = error.code;
  
      switch (errorCode) {
        case 'auth/email-already-in-use':
          setError('Este email já está em uso. Por favor, utilize outro email.');
          break;
        case 'auth/weak-password':
          setError('Senha muito fraca. Por favor, digite pelo menos 6 caracteres.');
          break;
        case 'auth/missing-password':
          setError('Digite alguma senha de pelo menos 6 caracteres.');
          break;
        default:
          setError('Erro ao criar a conta. Tente novamente mais tarde.');
          break;
      }
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
          backgroundImage: `url(src/assets/images/logo.png)`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          backgroundRepeat: 'no-repeat', 
          zIndex:'1',
          animation: 'slideDown 1s ease-out forwards', 
          '@keyframes slideDown': {
            '0%': {
              top: '-200px', 
            },
            '100%': {
              top: '0',
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
                  borderColor: 'white', 
                },
                '&:hover fieldset': {
                  borderColor: 'lightgray', 
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white', 
                },
              },
              '& .MuiInputLabel-root': {
                color: 'white', 
              },
              '& .MuiInputBase-input': {
                color: 'white', 
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white', 
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white', 
              },
              '& .MuiInputLabel-root.Mui-focused + .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white', 
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
                  borderColor: 'white', 
                },
                '&:hover fieldset': {
                  borderColor: 'lightgray', 
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white', 
                },
              },
              '& .MuiInputLabel-root': {
                color: 'white', 
              },
              '& .MuiInputBase-input': {
                color: 'white', 
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white', 
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white',
              },
              '& .MuiInputLabel-root.Mui-focused + .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
              },
            }}
          />
          <ButtonComponent type="submit" variant="contained" startIcon={<PersonAddAltIcon sx={{ color: (theme) => theme.palette.primary.main }} />}
  sx={{
    mt: 2,
    height: '6vh',
    backgroundColor: 'white', 
    color: (theme) => theme.palette.primary.main, 
    '&:hover': {
      backgroundColor: '#D3D3D3', 
      color: (theme) => theme.palette.primary.main, 
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

          {error && (
          <TypographyComponent variant="p" color="#F5F5F5" sx={{ mb: 2, textAlign:'center', marginTop:'20px', fontWeight: 'bold', fontSize:'20px'}}>
            {error}
          </TypographyComponent>
          )}
        </Box>
      </Box>

      <Box
        className="IllustrationContainer"
        sx={{
          display: 'flex',
          width: '57%',
          height: '100%',
          backgroundImage: `url(src/assets/images/illustration.jpg)`, 
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
