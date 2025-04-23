import {Page} from '@/shared/Page'
import {useAppSettings} from '@/core/context/ConfigContext'
import {UUID} from 'infoportal-common'
import {useEffect, useState} from 'react'
import {KoboFormListButton} from './KoboFormList'
import {useFetchers} from '@/shared/hook/useFetchers'
import {map} from '@axanc/ts-utils'
import {Box} from '@mui/material'
import {useFetcher} from '@/shared/hook/useFetcher'

export const DatabaseSources = ({serverId}: {serverId: UUID}) => {
  const {api} = useAppSettings()
  const fetcherKoboSchema = useFetcher(api.koboApi.searchSchemas)
  const _sources = useFetchers((formId: UUID) => api.koboApi.getSchema({id: formId}), {
    requestKey: ([_]) => _,
  })
  const [mainSource, setMainSource] = useState<UUID | undefined>()

  useEffect(() => {
    if (mainSource) _sources.fetch({}, mainSource)
  }, [mainSource])

  useEffect(() => {
    fetcherKoboSchema.fetch({}, {serverId})
    // _old.fetch()
  }, [])

  return (
    <Page>
      {fetcherKoboSchema.get && (
        <>
          <KoboFormListButton forms={fetcherKoboSchema.get} onChange={(_) => setMainSource(_)} />
          {map(_sources.get[mainSource!], (source) => (
            <>
              {source.content.survey.map((q) => (
                <Box key={q.name}>{q.name}</Box>
              ))}
            </>
          ))}
        </>
      )}
    </Page>
  )
}
