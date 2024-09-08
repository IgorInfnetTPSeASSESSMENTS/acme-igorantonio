import PropTypes from 'prop-types';
import { Button } from '@mui/material';


// eslint-disable-next-line react/prop-types
const ButtonComponent = ({ variant, size, onClick, disabled, children, ...rest }) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </Button>
  );
};

ButtonComponent.propTypes = {
  variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default ButtonComponent;