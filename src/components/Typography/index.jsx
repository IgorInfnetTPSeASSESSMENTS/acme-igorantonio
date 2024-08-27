import PropTypes from 'prop-types';
import { Typography } from '@mui/material';


const TypographyComponent = ({ variant, color, align, gutterBottom, children, ...rest }) => {
  return (
    <Typography
      variant={variant}
      color={color}
      align={align}
      gutterBottom={gutterBottom}
      {...rest}
    >
      {children}
    </Typography>
  );
};

TypographyComponent.propTypes = {
  variant: PropTypes.string,
  color: PropTypes.string,
  align: PropTypes.string,
  gutterBottom: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default TypographyComponent;