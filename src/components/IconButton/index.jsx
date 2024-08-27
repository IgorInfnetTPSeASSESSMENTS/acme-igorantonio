import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';

// eslint-disable-next-line react/prop-types
const IconButtonComponent = ({ tooltipTitle, onClick, color = "default", size = "medium", ...rest }) => {
  return (
    <Tooltip title={tooltipTitle || ""}>
      <IconButton onClick={onClick} color={color} size={size} {...rest}>
        <AddIcon />
      </IconButton>
    </Tooltip>
  );
};

export default IconButtonComponent;