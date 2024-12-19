import {useAppSettings} from '@/core/context/ConfigContext'
import {DrcOffice, nullValuesToUndefined} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'
import {AppFeatureId} from '@/features/appFeatureId'
import React, {ReactElement} from 'react'
import {Modal} from '@/shared/Modal'
import {Box} from '@mui/material'
import {Controller, useForm} from 'react-hook-form'
import {Obj} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {useAsync} from '@/shared/hook/useAsync'
import {useIpToast} from '@/core/useToast'
import {useEffectFn} from '@alexandreannic/react-hooks-lib'
import {AccessForm, IAccessForm} from '@/features/Access/AccessForm'
import {AccessFormSection} from '@/features/Access/AccessFormSection'
import {IpSelectMultiple} from '@/shared/Select/SelectMultiple'

import {useFetcher} from '@/shared/hook/useFetcher'

interface Form extends IAccessForm {
  drcOfficesDataFilter?: DrcOffice[]
}

export const WfpDeduplicationAccessForm = ({
  children,
  onAdded,
}: {
  onAdded?: () => void,
  children: ReactElement,
}) => {
  const {m} = useI18n()
  const {toastHttpError} = useIpToast()
  const {api} = useAppSettings()

  const _addAccess = useAsync(api.access.create)
  const requestInConstToFixTsInference = (databaseId: Kobo.FormId) => api.access.search({featureId: AppFeatureId.kobo_database})
    .then(_ => _.filter(_ => _.params?.koboFormId === databaseId))
  const _access = useFetcher(requestInConstToFixTsInference)

  useEffectFn(_addAccess.error, toastHttpError)
  useEffectFn(_access.error, toastHttpError)

  const accessForm = useForm<Form>()

  const submit = ({selectBy, drcOfficesDataFilter, ...f}: Form) => {
    _addAccess.call({
      ...nullValuesToUndefined(f),
      featureId: AppFeatureId.wfp_deduplication,
      params: {filters: {office: drcOfficesDataFilter}},
    }).then(onAdded)
  }

  return (
    <Modal
      loading={_addAccess.loading}
      confirmDisabled={!accessForm.formState.isValid}
      onConfirm={(_, close) => accessForm.handleSubmit(_ => {
        submit(_)
        close()
      })()}
      content={
        <Box sx={{width: 400}}>
          <AccessForm form={accessForm}/>
          <AccessFormSection icon="filter_alt" label={m.filter}>
            <Controller
              name="drcOfficesDataFilter"
              rules={{required: {value: true, message: m.required}}}
              control={accessForm.control}
              render={({field: {onChange, ...field}}) => (
                <IpSelectMultiple<DrcOffice>
                  {...field}
                  defaultValue={[]}
                  label={m.drcOffice}
                  onChange={_ => onChange(_)}
                  options={Obj.values(DrcOffice)}
                  sx={{mb: 2.5}}
                />
              )}
            />
          </AccessFormSection>
        </Box>
      }
    >
      {children}
    </Modal>
  )
}
