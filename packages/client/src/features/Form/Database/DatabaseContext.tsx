import React, {Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState} from 'react'
import {
  FetchParams,
  useAsync,
  UseAsyncSimple,
  useFetcher,
  useObjectState,
  UseObjectStateReturn,
} from '@axanc/react-hooks'
import {Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {Kobo} from 'kobo-sdk'
import {KoboSchemaHelper} from '@infoportal/kobo-helper'
import {useAppSettings} from '@/core/context/ConfigContext'
import * as csvToJson from 'csvtojson'
import {map, Obj, seq} from '@axanc/ts-utils'
import {UseDatabaseView, useDatabaseView} from '@/features/Form/Database/view/useDatabaseView'
import {DatabaseDisplay} from '@/features/Form/Database/groupDisplay/DatabaseKoboDisplay'
import {Ip} from '@infoportal/api-sdk'
import {ExternalFilesChoices, KoboExternalFilesIndex} from '@infoportal/database-column'
import {useFormContext} from '@/features/Form/Form'

export interface DatabaseContext {
  refetch: (p?: FetchParams) => Promise<void>
  form: Ip.Form
  permission: Ip.Permission.Form
  canEdit: boolean
  asyncRefresh: UseAsyncSimple<() => Promise<void>>
  koboEditEnketoUrl?: (answerId: Kobo.SubmissionId) => string
  data?: Submission[]
  loading?: boolean
  setData: Dispatch<SetStateAction<Submission[]>>
  externalFilesIndex?: KoboExternalFilesIndex
  view: UseDatabaseView
  groupDisplay: UseObjectStateReturn<DatabaseDisplay>
}

const Context = React.createContext({} as DatabaseContext)

export const useDatabaseKoboTableContext = () => useContext<DatabaseContext>(Context)

export const DatabaseKoboTableProvider = (props: {
  dataFilter?: (_: Submission) => boolean
  children: ReactNode
  loading?: boolean
  permission: Ip.Permission.Form
  refetch: (p?: FetchParams) => Promise<void>
  form: Ip.Form
  data?: Submission[]
}) => {
  const {form, data, children, refetch} = props
  const {api} = useAppSettings()
  const [indexExternalFiles, setIndexExternalFiles] = useState<KoboExternalFilesIndex>()
  const {schema} = useFormContext()

  const fetcherExternalFiles = useFetcher<() => Promise<{file: string; csv: string}[]>>(() => {
    return Promise.all(
      (schema.schema.files ?? []).map(file =>
        api.koboApi
          .proxy({method: 'GET', url: file.content, formId: form.id})
          .then((csv: string) => ({file: file.metadata.filename, csv}))
          .catch(() => {
            console.error(`Cannot get Kobo external files ${file.metadata.filename} from ${file.content}`)
            return undefined
          }),
      ),
    ).then(_ => seq(_).compact())
  })

  useEffect(() => {
    fetcherExternalFiles.fetch().then(async res => {
      const jsons: ExternalFilesChoices[][] = await Promise.all(
        res.map(_ => csvToJson.default({delimiter: ';'}).fromString(_.csv)),
      )
      const indexed = jsons.map(_ => seq(_).groupByFirst(_ => _.name))
      const indexes = seq(res).map((_, i) => ({file: _.file, index: indexed[i]}))
      setIndexExternalFiles(
        Obj.mapValues(
          seq(indexes).groupByFirst(_ => _.file),
          _ => _.index,
        ),
      )
    })
  }, [schema.schema])

  const asyncRefresh = useAsync(async () => {
    await api.koboApi.synchronizeAnswers(form.id)
    await refetch({force: true, clean: false})
  })

  const koboEditEnketoUrl = map(
    form.kobo?.koboId,
    koboId => (answerId: Kobo.SubmissionId) => api.koboApi.getEditUrl({formId: koboId, answerId}),
  )

  const [mappedData, setMappedData] = useState<Submission[] | undefined>(undefined)

  useEffect(() => {
    if (data) setMappedData(data)
  }, [data])

  const view = useDatabaseView(form.id)
  const groupDisplay = useObjectState<DatabaseDisplay>({
    repeatAs: undefined,
    repeatGroupName: schema.helper.group.search({depth: 1})?.[0]?.name,
  })

  return (
    <Context.Provider
      value={{
        ...props,
        externalFilesIndex: indexExternalFiles,
        asyncRefresh,
        form,
        canEdit: props.permission.answers_canUpdate && form.type !== 'smart',
        koboEditEnketoUrl,
        view,
        groupDisplay,
        data: mappedData,
        setData: setMappedData as Dispatch<SetStateAction<Submission[]>>,
      }}
    >
      {children}
    </Context.Provider>
  )
}
