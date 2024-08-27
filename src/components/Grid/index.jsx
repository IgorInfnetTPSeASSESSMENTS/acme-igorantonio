import { Grid } from "@mui/material"

// eslint-disable-next-line react/prop-types
const GridComponent = ({children, ...rest}) => {
  return (
    <Grid {...rest}>
      {children}
    </Grid>
  )
}

export default GridComponent;