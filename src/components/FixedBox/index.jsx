import { Box } from '@mui/material';

const FixedBox = ({ children }) => {
    return (
        <Box
            sx={{
                position: 'fixed',
                right: 16,
                bottom: 16,
                display: 'flex',
                alignItems: 'center',
                zIndex: 1200, // Garante que o box fique sobre outros elementos
            }}
        >
            {children}
        </Box>
    );
};

export default FixedBox;
