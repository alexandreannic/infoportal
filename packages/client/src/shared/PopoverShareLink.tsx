import {Box} from '@mui/material'
import {ReactElement} from 'react'
import {useI18n} from '@infoportal/client-i18n'
import {Core} from '.'
import {useIpToast} from '@/core/useToast'

export const PopoverShareLink = ({url, children}: {url: string; children?: ReactElement}) => {
  const {m} = useI18n()
  const {toastSuccess} = useIpToast()
  return (
    <Core.PopoverWrapper
      content={close => (
        <Box sx={{p: 2, width: 400}}>
          <Core.Txt size="big" block bold sx={{mb: 1}}>
            {m.copyLink}
          </Core.Txt>
          <Core.Input
            readOnly
            value={url}
            sx={{mb: 0.5}}
            helperText={null}
            endAdornment={
              <Core.IconBtn
                children="content_copy"
                onClick={() => {
                  navigator.clipboard.writeText(url)
                  toastSuccess(m.copiedToClipboard)
                }}
              />
            }
          ></Core.Input>
          <Core.Btn component="a" href={url} target="_blank" icon="open_in_new" sx={{mt: 1}} onClick={close}>
            {m.open}
          </Core.Btn>
          <Core.Btn sx={{mt: 1}} onClick={close}>
            {m.close}
          </Core.Btn>
        </Box>
      )}
    >
      {children ?? <BtnShare />}
    </Core.PopoverWrapper>
  )
}

export const BtnShare = (props: Core.BtnProps) => {
  const {m} = useI18n()
  return <Core.Btn icon="share" children={m.share} {...props} />
}
