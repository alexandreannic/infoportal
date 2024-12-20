import {CfmData, cfmMakeEditRequestKey, CfmStatusIconLabel, useCfmContext} from '@/features/Cfm/CfmContext'
import {useNavigate, useParams} from 'react-router'
import {Page, PageTitle} from '@/shared/Page'
import * as yup from 'yup'
import {IpBtn, ListRow, Modal, Txt} from '@/shared'
import {Box, Divider, Grid, Icon} from '@mui/material'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {useI18n} from '@/core/i18n'
import React, {useEffect, useMemo, useState} from 'react'
import {CfmDataProgram, CfmDataSource, DrcOffice, KoboMealCfmArea, KoboMealCfmStatus, KoboMealCfmTag, Meal_cfmInternal, Regexp} from 'infoportal-common'
import {KoboSelectTag} from '@/shared/KoboSelectTag'
import {Obj} from '@alexandreannic/ts-utils'
import {CfmPriorityLogo} from '@/features/Cfm/Data/CfmTable'
import {cfmIndex} from '@/features/Cfm/Cfm'
import {useSession} from '@/core/Session/SessionContext'
import {useAppSettings} from '@/core/context/ConfigContext'
import {TableInput} from '@/shared/TableInput'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {IpIconBtn} from '@/shared/IconBtn'
import {NavLink} from 'react-router-dom'
import {IpInput} from '@/shared/Input/Input'
import {useIpToast} from '@/core/useToast'
import {Fender} from '@/shared/Fender'
import {useKoboUpdateContext} from '@/core/context/KoboUpdateContext'

const routeParamsSchema = yup.object({
  formId: yup.string().required(),
  answerId: yup.string().required()
})
export const CfmEntryRoute = () => {
  const {formId, answerId} = routeParamsSchema.validateSync(useParams())
  const ctx = useCfmContext()
  const entry = useMemo(() => ctx.mappedData?.find(_ => _.id === answerId && formId === formId), [formId, ctx.mappedData])

  if (!entry && !ctx.fetching) {
    return (
      <Fender type="error">
        {formId}, {answerId}
      </Fender>
    )
  }
  return (
    <Page loading={ctx.fetching}>
      {entry && (
        <CfmDetails entry={entry}/>
      )}
    </Page>
  )
}

export const CfmDetails = ({entry}: {
  entry: CfmData
}) => {
  const {m, formatDateTime} = useI18n()
  const ctx = useCfmContext()
  const ctxKoboUpdate = useKoboUpdateContext()
  const navigate = useNavigate()
  const {api} = useAppSettings()
  const {session} = useSession()
  const canEdit = ctx.authorizations.sum.write || session.email === entry.tags?.focalPointEmail
  const [isEditing, setIsEditing] = useState(false)
  const [comment, setComment] = useState('')
  const {toastHttpError} = useIpToast()

  useEffect(() => {
    setComment(entry.tags?.notes ?? '')
  }, [entry])

  return (
    <Page>
      <PageTitle subTitle={formatDateTime(entry.date)} action={
        <>
          <CfmPriorityLogo fontSize="large" priority={entry.priority} sx={{mr: 2}}/>
          <div title={!entry.tags?.notes || entry.tags?.notes.trim() === '' ? 'Notes section is empty!' : ''} style={{width: '200px'}}>
            <KoboSelectTag<KoboMealCfmTag, CfmData>
              sx={{width: '100%'}}
              label={m.status}
              entry={entry}
              tag="status"
              formId={entry.formId}
              answerId={entry.id}
              enumerator={KoboMealCfmStatus}
              translate={new Obj(KoboMealCfmStatus)
                .filter(_ => !ctx.authorizations.sum.admin ? _ !== KoboMealCfmStatus.Archived : true)
                .mapValues(k => (
                  <CfmStatusIconLabel key={k} status={k!} sx={{display: 'flex', alignItems: 'center'}}/>
                ))
                .get()
              }
              disabled={!entry.tags?.notes || entry.tags?.notes.trim() === ''}
            />
          </div>
        </>
      }>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <NavLink to={cfmIndex.siteMap.data}>
            <IpIconBtn color="primary" sx={{mr: 1}}>arrow_back</IpIconBtn>
          </NavLink>
          {entry.id} - {m._cfm.formFrom[entry.form]}
        </Box>
      </PageTitle>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={6}>
          <Panel>
            <PanelHead action={
              canEdit && (
                <IpBtn
                  variant="outlined"
                  color="primary"
                  icon="edit"
                  href={api.koboApi.getEditUrl({formId: entry.formId, answerId: entry.id})}
                  target="_blank"
                >{m.edit}</IpBtn>
              )}
            >{m._cfm.reporterDetails}</PanelHead>
            <PanelBody>
              <ListRow icon="person" label={entry.name}/>
              <ListRow icon="phone" label={entry.phone}/>
              <ListRow icon="email" label={entry.email}/>
              <ListRow icon="female" label={ctx.schemaExternal.translate.choice('gender', entry.gender)}/>
              <Divider/>
              <ListRow icon="location_on" label={m.oblast}>{entry.oblast}</ListRow>
              <ListRow icon="" label={m.raion}>{ctx.schemaExternal.translate.choice('ben_det_raion', entry.ben_det_raion)}</ListRow>
              <ListRow icon="" label={m.hromada}>{ctx.schemaExternal.translate.choice('ben_det_hromada', entry.ben_det_hromada)}</ListRow>
              {entry.form === CfmDataSource.Internal ? (
                <>
                  <Divider/>
                  <ListRow icon="bookmark" label={m._cfm.existingDrcBeneficiary}>{entry.benef_origin}</ListRow>
                  <ListRow icon="" label={m.projectCode}>{entry.project}</ListRow>
                </>
              ) : entry.external_feedback_type === 'complaint' && (
                <>
                  <Divider/>
                  <ListRow icon="handshake" label={m._cfm.contactAgreement}>
                    {entry.external_prot_support === 'yes' ? (
                      <Icon color="success">check_circle</Icon>
                    ) : (
                      <Icon color="error">block</Icon>
                    )}
                    <Box sx={{ml: 1}}>
                      {ctx.schemaExternal.translate.choice('prot_support', entry.external_prot_support)}
                    </Box>
                  </ListRow>
                </>
              )}
            </PanelBody>
          </Panel>
        </Grid>
        <Grid item xs={6}>
          <Panel>
            <PanelBody>
              <ListRow icon="support_agent" label={m.focalPoint}>
                <TableInput
                  value={entry.tags?.focalPointEmail}
                  placeholder="@drc.ngo"
                  helper={(() => {
                    const email = entry.tags?.focalPointEmail
                    if (email && !Regexp.get.drcEmail.test(email)) return {
                      text: m.invalidEmail,
                      status: 'error'
                    }
                  })()}
                  onChange={_ => {
                    if (_ === undefined || Regexp.get.drcEmail.test(_))
                      ctxKoboUpdate.asyncUpdateById.tag.call({formId: entry.formId, answerIds: [entry.id], tag: 'focalPointEmail', value: _})
                  }}
                />
              </ListRow>
              <ListRow icon="work" label={m.program}>
                <KoboSelectTag<KoboMealCfmTag, CfmData>
                  showUndefinedOption
                  formId={entry.formId}
                  answerId={entry.id}
                  enumerator={CfmDataProgram}
                  tag="program"
                  entry={entry}
                />
              </ListRow>
              <ListRow icon="business" label={m.drcOffice}>
                <KoboSelectTag<KoboMealCfmTag, CfmData>
                  showUndefinedOption
                  formId={entry.formId}
                  answerId={entry.id}
                  enumerator={DrcOffice}
                  tag="office"
                  entry={entry}
                />
              </ListRow>
              <ListRow icon="map" label={m.area}>
                <KoboSelectTag<KoboMealCfmTag, CfmData>
                  showUndefinedOption
                  formId={entry.formId}
                  answerId={entry.id}
                  enumerator={KoboMealCfmArea}
                  tag="gca"
                  entry={entry}
                />
              </ListRow>
            </PanelBody>
          </Panel>
        </Grid>
      </Grid>
      <Panel>
        <PanelHead>{m._cfm.feedback} {entry.external_feedback_type ? `(${m._cfm._feedbackType[entry.external_feedback_type!]})` : ``}</PanelHead>
        <PanelBody>
          <IpSelectSingle
            sx={{mb: 2}}
            disabled={entry.form === CfmDataSource.Internal}
            defaultValue={entry.category}
            onChange={newValue => {
              ctxKoboUpdate.asyncUpdateById.tag.call({formId: entry.formId, answerIds: [entry.id], tag: 'feedbackTypeOverride', value: newValue})
            }}
            options={Obj.entries(Meal_cfmInternal.options.feedback_type).map(([k, v]) => ({value: k, children: v}))}
          />
          <Box>{entry.feedback}</Box>

          {entry.comments && <Txt block sx={{mt: 2}} bold size="big">{m.comments}</Txt>}
          {entry.comments}

          <Txt block sx={{mt: 2,}} bold size="big">{m.note}</Txt>
          <IpInput
            disabled={!isEditing}
            value={comment}
            multiline
            minRows={6}
            sx={{mb: 1}}
            helperText={null}
            maxRows={10}
            onChange={_ => setComment(_.target.value)}
          />
          {isEditing ? (
            <Box sx={{textAlign: 'right'}}>
              <IpBtn
                color="success"
                icon="check"
                size="small"
                variant="outlined"
                loading={ctxKoboUpdate.asyncUpdateById.tag.anyLoading}
                onClick={async () => {
                  await ctxKoboUpdate.asyncUpdateById.tag.call({formId: entry.formId, answerIds: [entry.id], tag: 'notes', value: comment}).catch(toastHttpError)
                  setIsEditing(false)
                }}
                sx={{marginLeft: 'auto', mr: 1}}
              >
                {m.save}
              </IpBtn>
              <IpBtn color="error" icon="cancel" size="small" variant="outlined" onClick={() => setIsEditing(false)}>{m.cancel}</IpBtn>
            </Box>
          ) : (
            <IpBtn icon="edit" size="small" variant="outlined" onClick={() => setIsEditing(true)}>{m.edit}</IpBtn>
          )}
        </PanelBody>
      </Panel>
      {ctx.authorizations.sum.admin && (
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <Modal
            loading={ctx.asyncRemove.loading[cfmMakeEditRequestKey(entry.formId, entry.id)]}
            content={m._cfm.deleteWarning}
            onConfirm={() => ctx.asyncRemove.call({formId: entry.formId, answerId: entry.id}).then(() => navigate(cfmIndex.siteMap.data))}
            title={m.shouldDelete}
          >
            <IpBtn
              icon="delete"
              size="large"
              sx={{margin: 'auto'}}
              variant="contained"
            >
              {m.remove}
            </IpBtn>
          </Modal>
        </Box>
      )}
    </Page>
  )
}