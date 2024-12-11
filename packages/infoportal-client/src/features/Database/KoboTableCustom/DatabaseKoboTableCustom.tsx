import React, {useEffect, useMemo, useState} from 'react'
import {Page} from '@/shared/Page'
import {Panel} from '@/shared/Panel'
import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {useKoboAnswersContext} from '@/core/context/KoboAnswersContext'
import {useParams} from 'react-router'
import * as yup from 'yup'
import {seq} from '@alexandreannic/ts-utils'
import {useI18n} from '@/core/i18n'
import {Datatable} from '@/shared/Datatable/Datatable'
import {useTheme} from '@mui/material'
import {getColumnsCustom} from '@/features/Database/KoboTable/columns/getColumnsCustom'
import {useKoboEditTagContext} from '@/core/context/KoboEditTagsContext'
import {databaseCustomMapping} from '@/features/Database/KoboTable/customization/customMapping'
import {getColumnsBase} from '@/features/Database/KoboTable/columns/getColumnsBase'
import {Kobo} from 'kobo-sdk'
import {KoboIndex, KoboSchemaHelper, KoboValidation} from 'infoportal-common'
import {useAppSettings} from '@/core/context/ConfigContext'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {useDatabaseView} from '@/features/Database/KoboTable/view/useDatabaseView'
import {DatabaseViewInput} from '@/features/Database/KoboTable/view/DatabaseViewInput'
import {columnBySchemaGenerator} from '@/features/Database/KoboTable/columns/columnBySchema'
import {DatatableColumn} from '@/shared/Datatable/util/datatableType'
import {useKoboEditAnswerContext} from '@/core/context/KoboEditAnswersContext'

interface CustomForm {
  id: string
  name: string
  // langs: string[]
  forms: {
    id: string
    // langIndexes?: number[]
    join?: {
      originId: Kobo.FormId, originColName: string, colName: string
    }
  }[]
}

export const customForms: CustomForm[] = [
  {
    id: 'vet',
    // langs: ['English (en)', 'Ukrainian (ua)'],
    name: '[ECREC] VET',
    forms: [
      {
        id: 'aGGGapARnC2ek7sA6SuHmu',
        // langIndexes: [1, 0],
      },
      {
        // langIndexes: [1, 0],
        id: 'a4iDDoLpUJHbu6cwsn2fnG',
        join: {originId: 'aGGGapARnC2ek7sA6SuHmu', originColName: 'id', colName: 'id_form_vet'}

      },
    ]
  },
  {
    id: 'msme',
    // langs: ['English (en)', 'Ukrainian (ua)'],
    name: '[ECREC] MSME',
    forms: [
      {
        id: KoboIndex.byName('ecrec_msmeGrantEoi').id,
        // langIndexes: [1, 0],
      },
      {
        id: KoboIndex.byName('ecrec_msmeGrantSelection').id,
        // langIndexes: [0, 1],
        join: {originId: KoboIndex.byName('ecrec_msmeGrantEoi').id, originColName: 'ben_det_tax_id_num', colName: 'tax_id_num'}
      },
      // {
      //   id: KoboIndex.byName('ecrec_msmeGrantSelection').id,
      //   // langIndexes: [1, 0],
      // },
      // {
      //   id: KoboIndex.byName('ecrec_msmeGrantEoi').id,
      //   // langIndexes: [0, 1],
      //   join: {originId: KoboIndex.byName('ecrec_msmeGrantSelection').id, originColName: 'ben_det_tax_id_num', colName: 'tax_id_num'}
      // },
    ]
  }
]

const urlValidation = yup.object({
  id: yup.string().required()
})

export const DatabaseTableCustomRoute = () => {
  const {api} = useAppSettings()
  const {m} = useI18n()
  const t = useTheme()

  const {id} = urlValidation.validateSync(useParams())

  const ctxEditTag = useKoboEditTagContext()
  const ctxEditAnswer = useKoboEditAnswerContext()
  const ctxSchema = useKoboSchemaContext()
  const ctxAnswers = useKoboAnswersContext()

  const customForm = useMemo(() => customForms.find(_ => _.id === id), [id])
  const formIds = useMemo(() => customForm!.forms.map(_ => _.id), [id])
  const {setTitle} = useLayoutContext()

  const [selectedIndexes, setSelectedIndexes] = useState<string[]>([])

  if (!customForm) return

  const view = useDatabaseView('custom-db-' + customForm.id)

  useEffect(() => {
    formIds.forEach(_ => {
      ctxAnswers.byId(_).fetch()
      ctxSchema.fetchById(_)
    })
  }, [formIds])

  const schemas = customForm.forms.map(_ => ({formId: _.id, schema: ctxSchema.byId[_.id]?.get})).filter(_ => !!_.schema) as {formId: Kobo.FormId, schema: KoboSchemaHelper.Bundle}[]

  useEffect(() => {
    setTitle(schemas.map(_ => _.schema.schema.name).join(' + '))
  }, [schemas])

  const data = useMemo(() => {
    const dataSets = formIds.map(_ => ctxAnswers.byId(_).get?.data)
    if (!dataSets.every(_ => _ !== undefined)) return
    const indexesParams = seq(customForm.forms)
      .compactBy('join')
      .flatMap(_ => [
        {formId: _.id, colName: _.join.colName},
        {formId: _.join.originId, colName: _.join.originColName},
      ])
      .distinct(_ => _.formId)
    const indexes = indexesParams.groupByAndApply(
      _ => _.formId,
      group => seq(ctxAnswers.byId(group[0].formId).get?.data.filter(_ => !_.tags || _.tags._validation !== KoboValidation.Rejected)!).groupByFirst(_ => (_ as any)[group[0].colName])
    )
    return dataSets[0]!.map((row, i) => {
      return {
        index: i,
        [customForm.forms[0].id]: (databaseCustomMapping[customForm.forms[0].id] ?? (_ => _))(row),
        ...seq(customForm.forms).compactBy('join').reduceObject(_ => {
          const refRow = indexes[_.id][(row as any)[_.join.originColName]]
          return [_.id, refRow ? (databaseCustomMapping[_.id] ?? (_ => _))(refRow) : undefined]
        })
      }
    })
  }, [...formIds.map(_ => ctxAnswers.byId(_).get?.data), ctxSchema.langIndex])

  const columns: DatatableColumn.Props<any>[] = useMemo(() => {
    return schemas.flatMap(({formId, schema}) => {
      const selectedIds = data ? selectedIndexes.map(_ => data[+_][formId]?.id).filter(_ => _ !== undefined) : []
      const cols = columnBySchemaGenerator({
        formId,
        schema,
        m,
        onEdit: selectedIds.length > 0 ? (questionName => ctxEditAnswer.open({
          formId: formId,
          question: questionName,
          answerIds: selectedIds,
        })) : undefined,
        t,
        getRow: _ => (_[formId] ?? {}) as any,
      }).getAll()
      cols[cols.length - 1].style = () => ({borderRight: '3px solid ' + t.palette.divider})
      cols[cols.length - 1].styleHead = {borderRight: '3px solid ' + t.palette.divider}
      return [
        ...getColumnsBase({
          selectedIds,
          formId,
          canEdit: true,
          m,
          open: ctxAnswers.openView,
          asyncEdit: (answerId: Kobo.SubmissionId) => api.koboApi.getEditUrl({formId: formId, answerId}),
          asyncUpdateTagById: ctxEditTag.asyncUpdateById,
          getRow: _ => (_[formId] ?? {}) as any,
          openEditTag: ctxEditTag.open,
        }),
        ...getColumnsCustom({
          getRow: _ => _[formId] ?? {},
          selectedIds,
          formId: formId,
          canEdit: true,
          m,
          asyncUpdateTagById: ctxEditTag.asyncUpdateById,
          openEditTag: ctxEditTag.open,
        }),
        ...cols
      ].map(_ => {
        return {
          ..._,
          id: formId + '_' + _.id,
          group: formId + _.group,
          groupLabel: schema.schema.name + '/' + _.groupLabel,
          width: view.colsById[formId + '_' + _.id]?.width ?? _.width ?? 90,
        }
      })
    })
  }, [...schemas, data, selectedIndexes, ctxSchema.langIndex, view.currentView])

  const loading = ctxSchema.anyLoading || !!formIds.find(_ => ctxAnswers.byId(_).loading)
  return (
    <>
      <Page width="full" sx={{p: 0}} loading={loading}>
        <Panel>
          <Datatable
            onResizeColumn={view.onResizeColumn}
            id={customForm.id}
            columns={columns}
            select={{
              onSelect: setSelectedIndexes,
              getId: _ => '' + _.index,
            }}
            data={data}
            showExportBtn
            columnsToggle={{
              disableAutoSave: true,
              hidden: view.hiddenColumns,
              onHide: view.setHiddenColumns,
            }}
            // exportAdditionalSheets={data => {
            //   const questionToAddInGroups = schemas.flatMap(({schema, formId}) => {
            //     return schema.schemaHelper.sanitizedSchema.content.survey.filter(_ => ['id', 'submissionTime', 'start', 'end'].includes(_.name))
            //   })
            //   return schemas.map(({formId, schema}) => {
            //
            //   })
            //   return Obj.entries(schemas.flatMap(_ => _.schema.schemaHelper.groupSchemas)).map(([groupName, questions]) => {
            //     const _: GenerateXlsFromArrayParams<any> = {
            //       sheetName: groupName as string,
            //       data: seq(data).flatMap(d => (d[groupName] as any[])?.map(_ => ({
            //         ..._,
            //         id: d.id,
            //         start: d.start,
            //         end: d.end,
            //         submissionTime: d.submissionTime,
            //       }))).compact(),
            //       schema: renderExportKoboSchema({
            //         formId: ctx.form.id,
            //         schema: [...questionToAddInGroups, ...questions],
            //         groupSchemas: ctx.schema.schemaHelper.groupSchemas,
            //         translateQuestion: ctx.schema.translate.question,
            //         translateChoice: ctx.schema.translate.choice,
            //       })
            //     }
            //     return _
            //   })
            header={
              <>
                <DatabaseViewInput sx={{mr: 1}} view={view}/>
                <IpSelectSingle<number>
                  hideNullOption
                  sx={{maxWidth: 128, mr: 1}}
                  defaultValue={ctxSchema.langIndex}
                  onChange={ctxSchema.setLangIndex}
                  options={[
                    {children: 'XML', value: -1},
                    // ...customForm.langs.map((l, i) => ({children: l, value: i})),
                    ...ctxSchema.byId[customForm.forms[0].id]?.get?.schemaSanitized.content.translations.map((_, i) => ({children: _, value: i})) ?? [],
                    // ...ctx.schema.schemaHelper.sanitizedSchema.content.translations.map((_, i) => ({children: _, value: i}))
                  ]}
                />
              </>
            }
          />
        </Panel>
      </Page>
    </>
  )
}
