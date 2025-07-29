import {useI18n} from '@/core/i18n'
import {IpAlert, IpBtn} from '@/shared'
import {IpInput} from '@/shared/Input/Input'
import {PanelFoot} from '@/shared/Panel/PanelFoot'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {Regexp} from 'infoportal-common'
import {Controller, useForm} from 'react-hook-form'
import {HttpError, Ip} from 'infoportal-api-sdk'
import {useQueryUser} from '@/core/query/useQueryUser'
import {useState} from 'react'
import {Collapse, Grow} from '@mui/material'

type Form = {
  email: Ip.User.Email
  level: Ip.AccessLevel
}

export const AddUserForm = ({
  workspaceId,
  existingEmails = [],
  onSubmit,
  onClose,
}: {
  workspaceId: Ip.WorkspaceId
  existingEmails?: Ip.User.Email[]
  onClose?: () => void
  onSubmit?: (_: Form) => Promise<any>
}) => {
  const {m} = useI18n()
  const form = useForm<Form>({mode: 'onChange', defaultValues: {email: '', level: Ip.AccessLevel.Read}})
  const queryUserCreate = useQueryUser.create(workspaceId)
  const [newInvitationSent, setNewInvitationSent] = useState(false)

  const submit = async (values: Form) => {
    setNewInvitationSent(false)
    const {newAccess, newInvitation} = await queryUserCreate.mutateAsync(values)
    if (newInvitation) {
      setNewInvitationSent(true)
    }
    form.reset()
    // onClose?.()
  }

  console.log(queryUserCreate.error)
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
          <IpInput
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
          <ScRadioGroup
            label={m.accessLevel}
            dense
            {...field}
            value={value}
            onChange={_ => onChange({target: {value: _}})}
          >
            {Object.keys(Ip.AccessLevel).map(_ => (
              <ScRadioGroupItem value={_} title={_} />
            ))}
          </ScRadioGroup>
        )}
      />
      <Collapse in={!!queryUserCreate.error} mountOnEnter unmountOnExit>
        <IpAlert
          sx={{mt: 1}}
          severity="error"
          action={<IpBtn children={m.close} color="inherit" size="small" onClick={() => setNewInvitationSent(false)} />}
        >
          {queryUserCreate.error instanceof HttpError.Conflict ? m.userInvitationAlreadySent : m.anErrorOccurred}
        </IpAlert>
      </Collapse>
      <Collapse in={newInvitationSent} mountOnEnter unmountOnExit>
        <IpAlert
          sx={{mt: 1}}
          severity="info"
          action={<IpBtn children={m.close} color="inherit" size="small" onClick={() => setNewInvitationSent(false)} />}
        >
          {m.userInvitationSent}
        </IpAlert>
      </Collapse>
      <PanelFoot sx={{mt: 2, p: 0}} alignEnd>
        {onClose && <IpBtn onClick={onClose}>{m.close}</IpBtn>}
        <IpBtn variant="outlined" type="submit" disabled={!form.formState.isValid} loading={queryUserCreate.isPending}>
          {m.submit}
        </IpBtn>
      </PanelFoot>
    </form>
  )
}
