import {Page} from '@/shared/Page'
import React from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Panel} from '@/shared/Panel'
import {AiBundleTable} from '@/features/ActivityInfo/shared/AiTable'
import {useFetcher} from '@/shared/hook/useFetcher'
import {AiMpcaMapper} from '@/features/ActivityInfo/Mpca/aiMpcaMapper'
import {Period} from 'infoportal-common'

export const AiMpca = () => {
  const {api} = useAppSettings()
  const fetcher = useFetcher((period: Partial<Period>) => AiMpcaMapper.reqCashRegistration(api)(period))
  const {conf} = useAppSettings()

  return (
    <Page width="full">
      <Panel>
        <AiBundleTable fetcher={fetcher} id="mpca" header={<>USD to UAH&nbsp;<b>{conf.uahToUsd}</b></>}/>
      </Panel>
    </Page>
  )
}