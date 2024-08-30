import { IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(-1); // Volta para a página anterior
    };

    return (
        <IconButton
            onClick={handleClick}
            sx={{
                backgroundColor: '#4682B4',
                borderRadius: '20px', // Ajuste o valor conforme desejado
                border: '1px solid #d0d0d0', // Cor da borda
                color: '#FFFFFF',
                padding: '8px',
                '&:hover': {
                    backgroundColor: '#145FF2', // Cor de fundo ao passar o mouse
                }
            }}
        >
            <ArrowBackIcon />
            <Typography variant="body1" color="white" sx={{ marginLeft: 1, fontWeight: 'bold' }}>
                Voltar
            </Typography>
        </IconButton>
    );
};


export default BackButton;
