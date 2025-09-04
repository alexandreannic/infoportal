import {Controller, useForm} from 'react-hook-form'
import {useI18n} from '@/core/i18n'
import {useQueryForm} from '@/core/query/useQueryForm'
import {Ip} from 'infoportal-api-sdk'
import {Autocomplete, Grid} from '@mui/material'
import {Core} from '@/shared'

type Form = {
  name: string
  category?: string
}

export const NewFormCreateInternal = ({
  workspaceId,
  onSubmit,
  loading,
  btnLabel,
}: {
  btnLabel?: string
  loading?: boolean
  onSubmit: (_: Form) => void
  workspaceId: Ip.WorkspaceId
}) => {
  const {m} = useI18n()
  const form = useForm<Form>({
    defaultValues: {name: '', category: ''},
  })
  const queryForm = useQueryForm(workspaceId)

  return (
    <form
      onSubmit={form.handleSubmit(async _ => {
        onSubmit(_)
        form.reset()
      })}
    >
      <Core.Panel>
        <Core.PanelBody>
          <Grid container>
            <Grid size={{xs: 12, sm: 6}}>
              <Controller
                name="name"
                rules={{required: true}}
                control={form.control}
                render={({field, fieldState}) => (
                  <Core.Input
                    required
                    label={m.name}
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{xs: 12, sm: 6}}>
              <Controller
                name="category"
                control={form.control}
                render={({field, fieldState}) => (
                  <Autocomplete
                    {...field}
                    freeSolo
                    disableClearable
                    options={queryForm.categories ?? []}
                    value={field.value}
                    onChange={(e, value) => field.onChange(value)}
                    onInputChange={(_, value) => field.onChange(value)}
                    renderInput={params => (
                      <Core.Input
                        {...params.InputProps}
                        inputProps={params.inputProps}
                        label={m.category}
                        ref={params.InputProps.ref}
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Core.PanelBody>
        <Core.PanelFoot>
          <Core.Btn variant="contained" type="submit" loading={loading}>
            {btnLabel ?? m.create}
          </Core.Btn>
        </Core.PanelFoot>
      </Core.Panel>
    </form>
  )
}
