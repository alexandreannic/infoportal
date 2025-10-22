import {useAppSettings} from '@/core/context/ConfigContext'
import {Core} from '@/shared'
import {useI18n} from '@infoportal/client-i18n'
import {Icon, SxProps} from '@mui/material'

type Props = {
  value?: string
  onChange?: (v: string) => void
  error?: boolean
  helperText?: string | null
  sx?: SxProps
}

export const MaterialIconSelector = ({sx, value = '', onChange, error, helperText}: Props) => {
  const {conf} = useAppSettings()
  const {m} = useI18n()

  return (
    <Core.Input
      fullWidth
      size="small"
      label={m._dashboard.selectMaterialIcons}
      value={value}
      onChange={e => onChange?.(e.target.value.trim())}
      error={error}
      helperText={
        helperText ?? (
          <>
            <Core.Txt
              component="span"
              size="small"
              block
              color="hint"
              dangerouslySetInnerHTML={{__html: m._dashboard.selectMaterialIconsDesc}}
            />
            <Core.Txt size="small" component="a" link {...{href: conf.externalLink.materialIcons}}>
              {conf.externalLink.materialIcons}
            </Core.Txt>
          </>
        )
      }
      startAdornment={
        <Icon color="disabled" sx={{mr: 1}}>
          {value ?? 'help_outline'}
        </Icon>
      }
      sx={sx}
    />
  )
}
