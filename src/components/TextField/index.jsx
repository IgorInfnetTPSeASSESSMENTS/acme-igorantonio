import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

const TextFieldComponent = ({ label, variant, type, value, onChange, disabled, fullWidth, placeholder, ...rest }) => {
  return (
    <TextField
      label={label}
      variant={variant}
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      fullWidth={fullWidth}
      placeholder={placeholder}
      {...rest}
    />
  );
};

TextFieldComponent.propTypes = {
  label: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default TextFieldComponent;