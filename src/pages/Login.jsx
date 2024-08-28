import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../infra/firebase.js';
import { Link as RouterLink } from 'react-router-dom';
import { Box, styled, Link } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { ButtonComponent, TextFieldComponent, TypographyComponent} from '../components';

const Logo = styled('img')({
    maxWidth: '100%',
    height: 'auto',
  });

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      console.log("Attempting login with email:", email);
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
    } catch (error) {
      console.error("Login error:", error);
      const errorCode = error.code;
  
      switch (errorCode) {
        case 'auth/invalid-email':
          setError('Email inválido. Verifique o formato do email.');
          break;
        case 'auth/missing-password':
          setError('Senha não fornecida. Por favor, insira sua senha.');
          break;
        case 'auth/wrong-password':
          setError('Senha incorreta. Tente novamente.');
          break;
        case 'auth/invalid-credential':
          setError('Credenciais de login inválidas. Verifique seu email e senha.');
          break;
        case 'auth/too-many-requests':
        setError('Você tentou logar muitas vezes, tente novamente mais tarde.');
        break;
        default:
          setError('Erro ao fazer login. Tente novamente mais tarde.');
          break;
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',  
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        mx: 'auto',
        p: 2,
        backgroundImage: `url(src/assets/images/background.jpg)`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box sx={{ maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column'}}>
        <Box
          sx={{
          display: 'flex',
          justifyContent: 'center', 
          alignItems: 'center', 
        }}
        >
            <Logo src="src/assets/images/logo.png" alt="Logo" sx={{height: '17vh', marginBottom:'3rem'}}/>
        </Box>
        <TextFieldComponent
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextFieldComponent
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <ButtonComponent type="submit" variant="contained" startIcon={<LoginIcon />} sx={{ mt: 2, height:'6vh'}}>
          Iniciar sessão
        </ButtonComponent>
        <TypographyComponent variant="body2" sx={{ mt: 2, textAlign: 'center'}}>
          Não tem uma conta?{' '}
          <Link component={RouterLink} to="/signup" 
          underline='hover'
            sx={{ 
              fontWeight: 'bold',
              color: '#145FF2',
              '&:hover': {
      color: '#1A61BE', 
    } 
              }} 
              >
              Crie uma conta aqui
            </Link>
        </TypographyComponent>

        {error && (
          <TypographyComponent variant="p" color="warning" sx={{ mb: 2, textAlign:'center', marginTop:'20px', fontWeight: 'bold', fontSize:'20px'}}>
            {error}
          </TypographyComponent>
          )}
      </Box>
    </Box>
  );
}

export default Login;
