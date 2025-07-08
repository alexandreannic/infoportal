import {Controller, useForm} from 'react-hook-form'
import {IpInput} from '@/shared/Input/Input'
import {Panel, PanelBody} from '@/shared/Panel'
import {useI18n} from '@/core/i18n'
import {useQueryForm} from '@/core/query/useQueryForm'
import {Ip} from 'infoportal-api-sdk'
import {PanelFoot} from '@/shared/Panel/PanelFoot'
import {IpBtn} from '@/shared'
import {Autocomplete, Grid} from '@mui/material'

type Form = {
  name: string
  category?: string
}

export const CreateNewForm = ({workspaceId}: {workspaceId: Ip.Uuid}) => {
  const {m} = useI18n()
  const form = useForm<Form>({
    defaultValues: {name: '', category: ''},
  })
  const queryForm = useQueryForm(workspaceId)
  return (
    <form
      onSubmit={form.handleSubmit(_ => {
        queryForm.create.mutateAsync(_).then(() => form.reset())
      })}
    >
      <Panel>
        <PanelBody>
          <Grid container>
            <Grid size={{xs: 12, sm: 6}}>
              <Controller
                name="name"
                rules={{required: true}}
                control={form.control}
                render={({field, fieldState}) => (
                  <IpInput
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
                    value={field.value ?? ''}
                    onInputChange={(_, value) => field.onChange(value)}
                    renderInput={params => (
                      <IpInput
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
        </PanelBody>
        <PanelFoot>
          <IpBtn variant="contained" type="submit" loading={queryForm.create.isPending}>
            {m.create}
          </IpBtn>
        </PanelFoot>
      </Panel>
    </form>
  )
}
