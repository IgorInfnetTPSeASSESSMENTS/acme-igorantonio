import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// eslint-disable-next-line react/prop-types
const LoadingComponent = ({ size = 40, color = "primary", ...rest }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" {...rest}>
      <CircularProgress size={size} color={color} />
    </Box>
  );
};

export default LoadingComponent;