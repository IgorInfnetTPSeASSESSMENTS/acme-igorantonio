import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../infra/firebase.js';
import { Link, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { ButtonComponent, TextFieldComponent, TypographyComponent } from '../components/index.jsx';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

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

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSignUp();
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
        backgroundImage: `url(src/assets/images/background.jpg)`, // Define a imagem de fundo
        backgroundSize: 'cover', // Ajusta o tamanho da imagem para cobrir o elemento
        backgroundPosition: 'center', // Centraliza a imagem de fundo
        backgroundRepeat: 'no-repeat', // Impede que a imagem se repita
        '@media (max-width: 600px)': {
      // Ajustes específicos para telas pequenas
      backgroundSize: 'contain', // Ajusta o tamanho da imagem para que caiba na tela
    }
      }}
    >
      <Box sx={{ maxWidth: 400, width: '100%', display: 'flex', flexDirection: 'column' }}>
        <TypographyComponent variant="h4" sx={{ mb: 4, textAlign: 'center'}}>
          Cadastre sua conta
        </TypographyComponent>
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
        <ButtonComponent type="submit" variant="contained" startIcon={<PersonAddAltIcon/>} sx={{ mt: 2, height:'6vh' }}>
          Criar Conta
        </ButtonComponent>
        <TypographyComponent variant="body2" sx={{ mt: 2, textAlign: 'center'}}>
          Já tem uma conta?{' '}
          <Link to="/login" underline="hover" sx={{ fontWeight: 'bold' }}>
            Faça login clicando aqui
          </Link>
        </TypographyComponent>
      </Box>
    </Box>
  );
}

export default SignUp;
