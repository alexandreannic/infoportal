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
import {fnSwitch, Obj} from '@axanc/ts-utils'

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
  const [result, setResult] = useState<'newAccess' | 'newInvitation'>()

  const submit = async (values: Form) => {
    setResult(undefined)
    const res = await queryUserCreate.mutateAsync(values)
    setResult(Obj.keys(res)[0])
    form.reset()
    // onClose?.()
  }

  const CloseBtn = <IpBtn children={m.close} color="inherit" size="small" onClick={() => setResult(undefined)} />

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
          action={CloseBtn}
        >
          {queryUserCreate.error instanceof HttpError.Conflict ? m.userInvitationAlreadySent : m.anErrorOccurred}
        </IpAlert>
      </Collapse>
      <Collapse in={!!result} mountOnEnter unmountOnExit>
        {result &&
          fnSwitch(result, {
            newAccess: (
              <IpAlert
                sx={{mt: 1}}
                severity="success"
                action={CloseBtn}
              >
                {m.userAdded}
              </IpAlert>
            ),
            newInvitation: (
              <IpAlert
                sx={{mt: 1}}
                severity="info"
                action={CloseBtn}
              >
                {m.userInvitationSent}
              </IpAlert>
            ),
          })}
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
