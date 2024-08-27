import { Alert } from "@mui/material";

// eslint-disable-next-line react/prop-types
const AlertComponent = ({children, variant, severity, ...rest}) => {
  return(
      <Alert severity={severity} variant={variant} {...rest}>
        {children}
      </Alert>
  )
}

export default AlertComponent;