import { Avatar } from "@mui/material"

// eslint-disable-next-line react/prop-types
const AvatarComponent = ({children, alt, src, ...rest}) => {
  return (
      <Avatar alt={alt} src={src} {...rest}>
        {children}
      </Avatar>
  )
}

export default AvatarComponent;