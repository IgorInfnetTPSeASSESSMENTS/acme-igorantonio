import { Checkbox } from "@mui/material";

const CheckboxComponent = ({...rest}, label) => {
  return (
      <Checkbox {...rest} {...label}/>
  )
}

export default CheckboxComponent;