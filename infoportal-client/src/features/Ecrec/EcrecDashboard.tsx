// import {AgeGroupTable} from '@/shared/AgeGroupTable'
// import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'
// import {UaMapBy} from '@/features/DrcUaMap/UaMapBy'
// import {OblastIndex} from '@infoportal-common'
// import {SlidePanel} from '@/shared/PdfLayout/PdfSlide'
// import {ChartLineBy} from '@/shared/charts/ChartLineBy'
// import {format} from 'date-fns'
import {EcrecData} from '@/features/Ecrec/useEcrecData'
import {AgeGroupTable} from '@/shared/AgeGroupTable'
import {ChartBarSingleBy} from '@/shared/charts/ChartBarSingleBy'
import {Seq} from '@alexandreannic/ts-utils'
import {UaMapBy} from '@/features/DrcUaMap/UaMapBy'
import {Ecrec_cashRegistration, KoboIndex, OblastIndex} from '@infoportal-common'
import {Div, SlidePanel} from '@/shared/PdfLayout/PdfSlide'
import {ChartLineBy} from '@/shared/charts/ChartLineBy'
import {format} from 'date-fns'

const labels = Ecrec_cashRegistration.options
export const darkTheme = true

export const EcrecDashboard = ({data}: {data: Seq<EcrecData>}) => {
  return (
    <Div responsive>
      <Div column>
        <SlidePanel title="Project"><ChartBarSingleBy data={data} by={_ => _.back_donor} label={labels.back_donor}/></SlidePanel>
        <SlidePanel title="Office"><ChartBarSingleBy data={data} by={_ => _.back_office} label={labels.back_office}/></SlidePanel>
        <AgeGroupTable tableId="" persons={data.flatMap(_ => _.custom.persons)}/>
      </Div>
      <Div column>
        <SlidePanel>
          <ChartLineBy getX={_ => format(_.submissionTime, 'yyyy-MM')} getY={_ => 1} label="Submissions" data={data}/>
        </SlidePanel>
        <SlidePanel title="Oblast"><UaMapBy getOblast={_ => OblastIndex.byKoboName(_.ben_det_oblast!).iso} data={data} fillBaseOn="value"/></SlidePanel>
      </Div>
    </Div>
  )
}