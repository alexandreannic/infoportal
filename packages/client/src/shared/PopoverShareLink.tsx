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
          <a href={url} target="_blank">
            <Core.Txt noWrap link block>
              {url}
            </Core.Txt>
          </a>
          <Core.Btn sx={{mt: 1}} onClick={close}>
            {m.close}
          </Core.Btn>
        </Box>
      )}
    >
      {children ?? <Core.Btn icon="share">{m.share}</Core.Btn>}
    </Core.PopoverWrapper>
  )
}
