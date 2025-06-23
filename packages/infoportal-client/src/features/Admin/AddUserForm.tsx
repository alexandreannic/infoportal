import {useI18n} from '@/core/i18n'
import {IpBtn} from '@/shared'
import {IpInput} from '@/shared/Input/Input'
import {PanelFoot} from '@/shared/Panel/PanelFoot'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {WorkspaceAccessLevel} from '@prisma/client'
import {Regexp} from 'infoportal-common'
import {Controller, useForm} from 'react-hook-form'

type Form = {
  email: string
  level: WorkspaceAccessLevel
}

export const AddUserForm = ({
  existingEmails = [],
  loading,
  onSubmit,
  onClose,
}: {
  existingEmails?: string[]
  loading?: boolean
  onClose?: () => void
  onSubmit: (_: Form) => Promise<any>
}) => {
  const {m} = useI18n()
  const form = useForm<Form>({mode: 'onChange', defaultValues: {email: '', level: 'User'}})

  const submit = async () => {
    await onSubmit(form.getValues())
    form.reset()
    onClose?.()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={form.control}
        rules={{
          required: true,
          validate: _ => !existingEmails.includes(_) || m.alreadyExists,
          pattern: {value: Regexp.get.email, message: m.invalidEmail},
        }}
        render={({field, fieldState}) => (
          <IpInput
            sx={{minWidth: 260, mb: 1, mt: 1}}
            {...field}
            label={m.email}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="level"
        control={form.control}
        rules={{
          required: true,
        }}
        render={({field: {onChange, value, ...field}}) => (
          <ScRadioGroup
            label={m.accessLevel}
            dense
            {...field}
            value={value}
            onChange={_ => onChange({target: {value: _}})}
          >
            {Object.keys(WorkspaceAccessLevel).map(_ => (
              <ScRadioGroupItem value={_} title={_} />
            ))}
          </ScRadioGroup>
        )}
      />
      <PanelFoot sx={{mt: 2, p: 0}} alignEnd>
        {onClose && <IpBtn onClick={onClose}>{m.close}</IpBtn>}
        <IpBtn variant="outlined" type="submit" disabled={!form.formState.isValid} onClick={submit} loading={loading}>
          {m.submit}
        </IpBtn>
      </PanelFoot>
    </form>
  )
}
