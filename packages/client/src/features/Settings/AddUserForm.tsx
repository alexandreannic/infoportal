import {useI18n} from '@infoportal/client-i18n'
import {Regexp} from '@infoportal/common'
import {Controller, useForm} from 'react-hook-form'
import {HttpError, Api} from '@infoportal/api-sdk'
import {Collapse} from '@mui/material'
import {UseQueryWorkspaceInvitation} from '@/core/query/workspace/useQueryWorkspaceInvitation.js'
import {Core} from '@/shared'

type Form = {
  email: Api.User.Email
  level: Api.AccessLevel
}

export const AddUserForm = ({
  workspaceId,
  existingEmails = [],
  onSubmit,
  onClose,
}: {
  workspaceId: Api.WorkspaceId
  existingEmails?: Api.User.Email[]
  onClose?: () => void
  onSubmit?: (_: Form) => Promise<any>
}) => {
  const {m} = useI18n()
  const form = useForm<Form>({mode: 'onChange', defaultValues: {email: '', level: Api.AccessLevel.Read}})
  const queryInvitation = UseQueryWorkspaceInvitation.create(workspaceId)

  const submit = async (values: Form) => {
    await queryInvitation.mutateAsync(values)
    form.reset()
    // onClose?.()
  }

  const CloseBtn = <Core.Btn children={m.close} color="inherit" size="small" onClick={queryInvitation.reset} />

  return (
    <form onSubmit={form.handleSubmit(submit)} style={{width: 400}}>
      <Controller
        name="email"
        control={form.control}
        rules={{
          required: true,
          validate: _ => !existingEmails.includes(_) || m.alreadyExists,
          pattern: {value: Regexp.get.email, message: m.invalidEmail},
        }}
        render={({field, fieldState}) => (
          <Core.Input
            required
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
          <Core.RadioGroup
            label={m.accessLevel}
            dense
            {...field}
            value={value}
            onChange={_ => onChange({target: {value: _}})}
          >
            {Object.keys(Api.AccessLevel).map(_ => (
              <Core.RadioGroupItem value={_} title={_} />
            ))}
          </Core.RadioGroup>
        )}
      />
      <Collapse in={!!queryInvitation.error} mountOnEnter unmountOnExit>
        <Core.Alert sx={{mt: 1}} severity="error" action={CloseBtn}>
          {queryInvitation.error instanceof HttpError.Conflict ? m.userInvitationAlreadySent : m.anErrorOccurred}
        </Core.Alert>
      </Collapse>
      <Collapse in={queryInvitation.isSuccess} mountOnEnter unmountOnExit>
        <Core.Alert sx={{mt: 1}} severity="success" action={CloseBtn}>
          {m.userInvitationSent}
        </Core.Alert>
      </Collapse>
      <Core.PanelFoot sx={{mt: 2, p: 0}} alignEnd>
        {onClose && <Core.Btn onClick={onClose}>{m.close}</Core.Btn>}
        <Core.Btn
          variant="outlined"
          type="submit"
          disabled={!form.formState.isValid}
          loading={queryInvitation.isPending}
        >
          {m.submit}
        </Core.Btn>
      </Core.PanelFoot>
    </form>
  )
}
