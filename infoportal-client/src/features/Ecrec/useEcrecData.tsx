import {useAppSettings} from '@/core/context/ConfigContext'
import {useFetcher} from '@alexandreannic/react-hooks-lib'
import {useEffect} from 'react'
import {KoboEcrec_cashRegistration, Ecrec_cashRegistration, KoboGeneralMapping} from '@infoportal-common'
import {KoboAnswer} from '@/core/sdk/server/kobo/Kobo'
import {ApiPaginate} from '@/core/sdk/server/_core/ApiSdkUtils'

export type EcrecData = KoboAnswer<Ecrec_cashRegistration.T> & {
  custom: KoboGeneralMapping.IndividualBreakdown
  tags?: KoboEcrec_cashRegistration.Tags
}

export const useEcrecData = () => {
  const {api} = useAppSettings()
  const fetcher = useFetcher(api.kobo.typedAnswers.searchEcrec_cashRegistration as () => Promise<ApiPaginate<EcrecData>>)

  useEffect(() => {
    fetcher.fetch()
  }, [])

  return fetcher
}