import {EcrecDashboard} from '@/features/Ecrec/EcrecDashboard'
import {Page} from '@/shared/Page'
import {useEcrecData} from '@/features/Ecrec/useEcrecData'
import { seq } from '@alexandreannic/ts-utils'

export const EcrecRoot = () => {
  const data = useEcrecData()
  return (
    <Page loading={data.loading}>
      {data.entity && (
        <EcrecDashboard data={seq(data.entity.data)}/>
      )}
    </Page>
  )
}