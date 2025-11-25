import {Box, InputBase, useTheme} from '@mui/material'
import * as Core from '@infoportal/client-core'
import {useXlsFormStore} from '../core/useStore'
import {useI18n} from '@infoportal/client-i18n'

export const TranslationsManager = () => {
  const {m} = useI18n()
  const t = useTheme()
  const translations = useXlsFormStore(_ => _.schema.translations)
  const setTranslations = useXlsFormStore(_ => _.setTranslations)
  return (
    <Core.Modal
      title={m.translations}
      content={
        <Box sx={{minWidth: 300}}>
          <Box
            sx={{
              mb: 1,
              border: '1px solid',
              borderColor: t.vars.palette.divider,
              borderRadius: t.vars.shape.borderRadius,
            }}
          >
            {translations.map((translation, i) => (
              <Box
                key={i}
                sx={{
                  py: 0.5,
                  px: 1,
                  display: 'flex',
                  alignItems: 'center',
                  '&:not(:last-of-type)': {
                    borderBottom: '1px solid',
                    borderColor: t.vars.palette.divider,
                  },
                }}
              >
                <InputBase
                  value={translation}
                  onChange={e =>
                    setTranslations(
                      translations.map(_ => {
                        if (translation === _) return e.target.value
                        return _
                      }),
                    )
                  }
                />
                <Core.IconBtn
                  color="error"
                  children="delete"
                  size="small"
                  sx={{marginLeft: 'auto'}}
                  onClick={() => setTranslations(translations.filter(_ => _ !== translation))}
                />
              </Box>
            ))}
          </Box>
          <Core.Btn
            icon="add"
            variant="outlined"
            fullWidth
            onClick={() => setTranslations([...translations, `Lang (${translations.length})`])}
          >
            {m.add}
          </Core.Btn>
        </Box>
      }
    >
      <Core.Btn variant="outlined" size="small" icon="translate">
        {m.translations}
      </Core.Btn>
    </Core.Modal>
  )
}
