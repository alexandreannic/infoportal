import {IpIconBtn, IpIconBtnProps} from '@/shared/IconBtn'

const DatatableCellIconBtn = ({sx, color, size = 'small', ...props}: IpIconBtnProps) => {
  return (
    <IpIconBtn
      color={color}
      size={size}
      sx={{
        verticalAlign: 'middle',
        // fontSize: '20px !important',
        ...sx,
      }}
      {...props}
    />
  )
}

export default DatatableCellIconBtn
