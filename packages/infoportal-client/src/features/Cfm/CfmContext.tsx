import React, {ReactNode, useContext, useEffect, useMemo} from 'react'
import {
  CfmDataPriority,
  CfmDataProgram,
  CfmDataSource,
  DrcOffice,
  DrcProject,
  DrcProjectHelper,
  KoboSubmissionFlat,
  KoboIndex,
  KoboMealCfmHelper,
  KoboMealCfmStatus,
  KoboMealCfmTag,
  KoboSchemaHelper,
  Meal_cfmExternal,
  Meal_cfmInternal,
  OblastIndex,
  OblastISO,
  OblastName
} from 'infoportal-common'
import {useAsync, UseAsyncMultiple} from '@/shared/hook/useAsync'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Access, AccessSum} from '@/core/sdk/server/access/Access'
import {AppFeatureId} from '@/features/appFeatureId'
import {useSession} from '@/core/Session/SessionContext'
import {ApiSdk} from '@/core/sdk/server/ApiSdk'
import {fnSwitch, map, Obj, Seq, seq} from '@alexandreannic/ts-utils'
import {useFetcher, UseFetcher} from '@/shared/hook/useFetcher'
import {TableIcon, TableIconProps} from '@/features/Mpca/MpcaData/TableIcon'
import {Box, BoxProps} from '@mui/material'
import {useKoboEditTagContext} from '@/core/context/KoboEditTagsContext'
import {useKoboAnswersContext} from '@/core/context/KoboAnswersContext'
import {Kobo} from 'kobo-sdk'
import {useKoboEditAnswerContext} from '@/core/context/KoboEditAnswersContext'

export enum CfmDataOrigin {
  Internal = 'Internal',
  External = 'External',
}

export const CfmStatusIcon = ({status, ...props}: {
  status: KoboMealCfmStatus
} & Omit<TableIconProps, 'children'>) => fnSwitch(status, {
  [KoboMealCfmStatus.Close]: <TableIcon {...props} tooltip="Close" color="success">check_circle</TableIcon>,
  [KoboMealCfmStatus.Open]: <TableIcon {...props} tooltip="Open" color="warning">new_releases</TableIcon>,
  [KoboMealCfmStatus.Processing]: <TableIcon {...props} tooltip="Processing" color="info">schedule</TableIcon>,
  [KoboMealCfmStatus.Archived]: <TableIcon {...props} tooltip="Processing" color="disabled">archive</TableIcon>,
})

export const CfmStatusIconLabel = ({status, ...props}: {
  status: KoboMealCfmStatus
} & Omit<BoxProps, 'status' | 'children'>) => (
  <Box component="span" {...props}>
    <CfmStatusIcon status={status} sx={{mr: 1}}/>
    {status}
  </Box>
)

export const cfmStatusIconIndex = Obj.mapValues(KoboMealCfmStatus, _ => <CfmStatusIcon status={_}/>)

export type CfmData = {
  readonly origin: CfmDataOrigin
  readonly priority?: CfmDataPriority
  readonly formId: Kobo.FormId
  readonly tags?: KoboMealCfmTag
  readonly form: CfmDataSource
  readonly comments?: string
  readonly feedback?: string
  readonly additionalInformation?: string
  readonly project?: DrcProject
  readonly oblast: OblastName
  readonly oblastIso: OblastISO
  readonly category?: Meal_cfmInternal.T['feedback_type']
  readonly external_prot_support?: Meal_cfmExternal.T['prot_support']
  readonly benef_origin?: Meal_cfmInternal.T['benef_origin']
  // internal_project_code?: Meal_CfmInternal.T['project_code']
  // external_thanks_feedback?: MealCfmExternal['thanks_feedback']
  // external_complaint?: MealCfmExternal['complaint']
  external_consent?: Meal_cfmExternal.T['consent']
  external_feedback_type?: Meal_cfmExternal.T['feedback_type']
  // internal_feedback?: Meal_CfmInternal.T['feedback']
  // internal?: Pick<Meal_CfmInternal.T, 'feedback' | 'existing_beneficiary' | 'project_code'>
  // external?: Pick<MealCfmExternal, 'prot_support' | 'thanks_feedback' | 'complaint' | 'consent' | 'feedback_type'>
} & Pick<KoboSubmissionFlat<Meal_cfmInternal.T>,
  // 'ben_det_oblast' |
  'ben_det_raion' |
  'ben_det_hromada'
> & Pick<KoboSubmissionFlat<Meal_cfmInternal.T>,
  'id' |
  'start' |
  'date' |
  'end' |
  'submissionTime' |
  'name' |
  'gender' |
  'phone' |
  'email'
>

export interface CfmContext {
  authorizations: {
    sum: AccessSum,
    accessibleOffices?: DrcOffice[]
    accessiblePrograms?: CfmDataProgram[]
    // seeHisOwn: boolean
  }
  fetching?: boolean
  schemaInternal: KoboSchemaHelper.Bundle
  schemaExternal: KoboSchemaHelper.Bundle
  asyncRemove: UseAsyncMultiple<(_: {
    formId: Kobo.FormId,
    answerId: Kobo.SubmissionId
  }) => Promise<void>, Kobo.FormId>
  users: UseFetcher<ApiSdk['user']['search']>
  mappedData: Seq<CfmData>
  visibleData: Seq<CfmData>
}

const CfmContext = React.createContext({} as CfmContext)

export const useCfmContext = () => useContext<CfmContext>(CfmContext)

export const cfmMakeEditRequestKey = (form: Kobo.FormId, answerId: Kobo.SubmissionId) => form + answerId

export const CfmProvider = ({
  children,
  schemaInternal,
  schemaExternal,
}: {
  schemaInternal: KoboSchemaHelper.Bundle
  schemaExternal: KoboSchemaHelper.Bundle
  children: ReactNode
}) => {
  const {session, accesses} = useSession()
  const {api} = useAppSettings()
  const ctxAnswers = useKoboAnswersContext()
  const ctxKoboEdit = useKoboEditAnswerContext()
  const users = useFetcher(() => api.user.search())
  const fetcherInternal = ctxAnswers.byName('meal_cfmInternal')
  const fetcherExternal = ctxAnswers.byName('meal_cfmExternal')

  const authorizations: CfmContext['authorizations'] = useMemo(() => {
    const cfmAccesses = seq(accesses).filter(Access.filterByFeature(AppFeatureId.cfm))
    const sum = Access.toSum(cfmAccesses, session.admin)
    const accessibleOffices = cfmAccesses.map(_ => _.params).flatMap(_ => _?.office).compact().get()
    const accessiblePrograms = cfmAccesses.map(_ => _.params).flatMap(_ => _?.program).compact().get()
    // const seeHisOwn = !!cfmAccesses.find(_ => _.params?.seeHisOwn)
    return {
      sum,
      accessibleOffices: accessibleOffices.length === 0 ? undefined : accessibleOffices,
      accessiblePrograms: accessiblePrograms.length === 0 ? undefined : accessiblePrograms,
      // seeHisOwn: seeHisOwn,
    }
  }, [session, accesses])

  const mappedData = useMemo(() => {
    return map(fetcherInternal.get, fetcherExternal.get, (internal, external) => {
      const res: CfmData[] = []
      external.data.forEach(_ => {
        const category = _.tags?.feedbackTypeOverride
        res.push({
          category,
          project: _.tags?.project,
          priority: KoboMealCfmHelper.feedbackType2priority(category),
          formId: KoboIndex.byName('meal_cfmExternal').id,
          origin: CfmDataOrigin.External,
          external_feedback_type: _.feedback_type,
          external_consent: _.consent,
          external_prot_support: _.prot_support,
          form: CfmDataSource.External,
          oblast: OblastIndex.byKoboName(_.ben_det_oblast!)!.name,
          oblastIso: OblastIndex.byKoboName(_.ben_det_oblast!)!.iso,
          feedback: _.complaint ?? _.thanks_feedback ?? _.request,
          ..._,
        })
      })
      internal.data.forEach(_ => {
        const category = _.tags?.feedbackTypeOverride ?? _.feedback_type
        const koboCode = _.project_code === 'Other' ? _.project_code_specify : _.project_code
        const parsedCode = koboCode?.match(/UKR.(000\d\d\d)/)?.[1]
        res.push({
          project: DrcProjectHelper.searchByCode(parsedCode),
          priority: KoboMealCfmHelper.feedbackType2priority(category),
          category,
          formId: KoboIndex.byName('meal_cfmInternal').id,
          origin: CfmDataOrigin.Internal,
          form: CfmDataSource.Internal,
          // internal_project_code: _.project_code,
          oblast: OblastIndex.byKoboName(_.ben_det_oblast!).name,
          oblastIso: OblastIndex.byKoboName(_.ben_det_oblast!).iso,
          ..._,
        })
      })
      return seq(res).sort((b, a) => (a.date ?? a.submissionTime).getTime() - (b.date ?? b.submissionTime).getTime())
    }) ?? seq([])
  }, [
    fetcherInternal.get,
    fetcherExternal.get,
  ])

  const visibleData = useMemo(() => {
    return mappedData?.filter(_ => {
      if (_.tags?.deletedBy) return false
      if (session.email === _.tags?.focalPointEmail)
        return true
      if (!authorizations.sum.read)
        return false
      if (authorizations.accessiblePrograms && !authorizations.accessiblePrograms.includes(_.tags?.program!))
        return false
      if (authorizations.accessibleOffices && !authorizations.accessibleOffices.includes(_.tags?.office!))
        return false
      // if (authorizations.accessibleEmails && !authorizations.accessibleEmails.includes(_.tags?.focalPointEmail!))
      //   return false
      return true
    })
  }, [mappedData, authorizations.accessiblePrograms, authorizations.accessibleOffices])

  const asyncRemove = useAsync(async ({formId, answerId}: {
    formId: Kobo.FormId,
    answerId: Kobo.SubmissionId
  }) => {
    await ctxKoboEdit.asyncUpdateById.tag.call({
      formId,
      answerIds: [answerId],
      tag: 'deletedBy',
      value: session.email ?? 'unknown'
    })
  }, {
    requestKey: ([_]) => cfmMakeEditRequestKey(_.formId, _.answerId)
  })

  useEffect(() => {
    fetcherExternal.fetch({})
    fetcherInternal.fetch({})
    users.fetch()
  }, [])

  return (
    <CfmContext.Provider value={{
      authorizations,
      asyncRemove,
      fetching: fetcherInternal.loading || fetcherExternal.loading,
      users,
      mappedData: mappedData,
      visibleData: visibleData,
      schemaInternal,
      schemaExternal,
    }}>
      {children}
    </CfmContext.Provider>
  )
}
