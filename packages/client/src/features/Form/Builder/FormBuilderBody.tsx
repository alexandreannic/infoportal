import {useFormBuilderContext} from '@/features/Form/Builder/FormBuilder'
import {TabContent} from '@/shared/Tab/TabContent'
import {SxProps} from '@mui/material'
import {ReactNode} from 'react'

export const FormBuilderBody = ({sx, fullWidth, children, ...props}: {
  fullWidth?: boolean
  children: ReactNode
  sx?: SxProps
}) => {
  const showPreview = useFormBuilderContext(_ => _.showPreview)
  return (
    <TabContent
      {...props}
      sx={{
        marginRight: 'auto',
        marginLeft: 'auto',
        width: fullWidth || showPreview ? '100%' : '50%',
        ...sx,
      }}
    >
      {children}
    </TabContent>
  )
}