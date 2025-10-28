import {Core} from '@/shared'
import {useI18n} from '@infoportal/client-i18n'
import {Box, useTheme} from '@mui/material'
import {Controller} from 'react-hook-form'
import {useDashboardContext} from './DashboardContext'
import {ColorPicker} from './Widget/shared/ColorPicker'
import {SliderNumberInput} from './Widget/shared/SliderNumberInput'
import {WidgetSettingsSection} from './Widget/shared/WidgetSettingsSection'

export function DashboardTheme() {
  const {form, values} = useDashboardContext(_ => _.updateForm)
  const {m} = useI18n()
  const t = useTheme()
  return (
    <Box>
      <WidgetSettingsSection title={m.global}>
        <Controller
          control={form.control}
          name="theme.colorPrimary"
          render={({field}) => <ColorPicker {...field} label={m._dashboard.theme.primaryColor} sx={{mb: 2}} />}
        />
        <Controller
          control={form.control}
          name="theme.bgColor"
          render={({field}) => <ColorPicker label={m._dashboard.theme.bgColor} {...field} />}
        />
        <Controller
          control={form.control}
          name="theme.spacing"
          render={({field}) => (
            <SliderNumberInput label={m._dashboard.theme.spacing} sx={{mt: 2}} min={0} max={30} {...field} />
          )}
        />
      </WidgetSettingsSection>
      <WidgetSettingsSection title={m.card}>
        <Controller
          control={form.control}
          name="theme.borderRadius"
          render={({field}) => (
            <SliderNumberInput label={m._dashboard.theme.borderRadius} min={0} max={30} {...field} />
          )}
        />
        <Controller
          control={form.control}
          name="theme.cardElevation"
          render={({field}) => (
            <SliderNumberInput label={m._dashboard.theme.elevation} sx={{mt: 2}} min={0} max={30} {...field} />
          )}
        />
        <Controller
          control={form.control}
          name="theme.cardBorderSize"
          render={({field}) => (
            <SliderNumberInput label={m._dashboard.theme.cardBorderSize} sx={{mt: 2}} min={0} max={5} {...field} />
          )}
        />
        <Controller
          control={form.control}
          name="theme.cardOpacity"
          render={({field}) => (
            <SliderNumberInput label={m._dashboard.theme.cardOpacity} sx={{mt: 2}} min={0} max={10} {...field} />
          )}
        />
        <Controller
          control={form.control}
          name="theme.cardBlur"
          render={({field}) => (
            <SliderNumberInput
              disabled={!values.theme?.cardOpacity || values.theme.cardOpacity === 1}
              label={m._dashboard.theme.cardBlur}
              sx={{mt: 2}}
              min={0}
              max={20}
              {...field}
            />
          )}
        />
      </WidgetSettingsSection>
      <Core.Btn
        sx={{width: `calc(100% - ${t.vars.spacing} * 2)`, m: 1, mt: 0}}
        variant="outlined"
        icon="settings_backup_restore"
        onClick={() => {
          form.resetField('theme')
        }}
      >
        {m.resetDefault}
      </Core.Btn>
    </Box>
  )
}
