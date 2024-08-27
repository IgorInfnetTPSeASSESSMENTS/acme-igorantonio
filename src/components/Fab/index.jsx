import { Fab } from "@mui/material"

// eslint-disable-next-line react/prop-types
const FabComponent = ({children, ...rest}) => {
  return (
    <Fab {...rest}>
      {children}
    </Fab>
  )
}

export default FabComponent;