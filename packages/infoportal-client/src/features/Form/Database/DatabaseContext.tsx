import React, {Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from 'react'
import {useAsync, UseAsyncSimple} from '../../../../../infoportal-client-core/src/hook/useAsync'
import {Submission} from '@/core/sdk/server/kobo/KoboMapper'
import {Kobo} from 'kobo-sdk'
import {KoboSchemaHelper} from 'infoportal-common'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useFetcher} from '../../../../../infoportal-client-core/src/hook/useFetcher'
import * as csvToJson from 'csvtojson'
import {map, Obj, seq} from '@axanc/ts-utils'
import {FetchParams} from '../../../../../infoportal-client-core/src/hook/useFetchers'
import {UseDatabaseView, useDatabaseView} from '@/features/Form/Database/view/useDatabaseView'
import {useObjectState, UseObjectStateReturn} from '../../../../../infoportal-client-core/src/hook/useObjectState'
import {DatabaseDisplay} from '@/features/Form/Database/groupDisplay/DatabaseKoboDisplay'
import {Ip} from 'infoportal-api-sdk'

export type ExternalFilesChoices = {list_name: string; name: string; label: string}
export type KoboExternalFilesIndex = Record<string, Record<string, ExternalFilesChoices>>

export interface DatabaseContext {
  refetch: (p?: FetchParams) => Promise<void>
  schema: KoboSchemaHelper.Bundle
  form: Ip.Form
  permission: Ip.Permission.Form
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
  schema: KoboSchemaHelper.Bundle
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

  const fetcherExternalFiles = useFetcher<() => Promise<{file: string; csv: string}[]>>(() => {
    return Promise.all(
      (props.schema.schema.files ?? []).map(file =>
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
  }, [props.schema.schema])

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
    repeatGroupName: props.schema.helper.group.search({depth: 1})?.[0]?.name,
  })

  return (
    <Context.Provider
      value={{
        ...props,
        externalFilesIndex: indexExternalFiles,
        asyncRefresh,
        form,
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
