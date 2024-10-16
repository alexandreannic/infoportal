import {Page, PageHeader} from '@/shared/Page'
import {useParams} from 'react-router'
import React, {useEffect} from 'react'
import {useI18n} from '@/core/i18n'
import {Txt} from '@/shared'
import {Panel, PanelBody, PanelHead} from '@/shared/Panel'
import {useAppSettings} from '@/core/context/ConfigContext'
import {map} from '@alexandreannic/ts-utils'
import {getKoboImagePath} from '@/features/Mpca/MpcaData/MpcaData'
import {MpcaPaymentToolForm} from './MpcaPaymentToolForm'
import * as yup from 'yup'
import {Grid} from '@mui/material'
import {ListRow} from '@/shared/ListRow'
import {IpBtn} from '@/shared/Btn'
import {TableImg} from '@/shared/TableImg/TableImg'
import {useAsync} from '@/shared/hook/useAsync'
import {useFetcher} from '@/shared/hook/useFetcher'
import {KoboAnswerId} from 'infoportal-common'
import {Datatable} from '@/shared/Datatable/Datatable'
import {IpAlert} from '@/shared/Alert'

const urlValidation = yup.object({
  id: yup.string().required()
})

const amounts = {
  mpcaGrantAmount: 2220,
  cfrGrantAmount: [6500, 7000, 8500],
  startupGrantAmount: 5000,
}
export const MpcaPaymentTool = () => {
  const {id} = urlValidation.validateSync(useParams())
  const {api} = useAppSettings()
  const {m, formatLargeNumber, formatDate} = useI18n()
  const _getPayment = useFetcher(api.mpcaPayment.get)
  const _update = useAsync(api.mpcaPayment.update)
  const _answers = useFetcher((ids: KoboAnswerId[]) => {
      // const fnMap = mapMpcaKoboAnswer()
      return api.kobo.typedAnswers.searchByAccess.bn_re()
        .then(_ => _.data.filter(_ => ids.includes(_.id)))//.map(fnMap))
    }
  )

  const tool = _getPayment.get

  useEffect(() => {
    _getPayment.fetch({force: true}, id)
  }, [id])

  useEffect(() => {
    if (!tool) return
    _answers.fetch({}, tool.answers)
  }, [tool])

  return (
    <Page width="full">
      {tool && (
        <>
          <PageHeader sx={{mb: 0}} action={
            <IpBtn variant="contained" icon="download">{m.downloadAsPdf}</IpBtn>
          }>
            {m.mpca.paymentTool} #{tool.index}
          </PageHeader>
          <Txt color="hint" size="big" block sx={{mb: 2}}>{formatDate(tool?.createdAt)}</Txt>
          <IpAlert id="mpca-payment" sx={{mb: 2}} color="info" deletable="permanent">{m.mpca.allAmountsAreWithoutTaxes}</IpAlert>

          <Grid container spacing={2}>
            <Grid item sm={6}>
              <Panel>
                <PanelHead>{m.information}</PanelHead>
                <PanelBody>
                  <MpcaPaymentToolForm tool={tool} onChange={_ => {
                    _update.call(tool.id, _).then(() => _getPayment.fetch({clean: false, force: true}, id))
                  }}/>
                </PanelBody>
              </Panel>
            </Grid>
            <Grid item sm={6}>
              <Panel>
                <PanelHead>{m.calculations}</PanelHead>
                <PanelBody>
                  <ListRow label={m.mpca.mpcaGrantAmount}><Txt size="big" bold>{formatLargeNumber(amounts.mpcaGrantAmount)}</Txt></ListRow>
                  <ListRow label={m.mpca.cfrGrantAmount}><Txt size="big" bold>{amounts.cfrGrantAmount.map(_ => formatLargeNumber(_)).join(' - ')}</Txt></ListRow>
                  <ListRow label={m.mpca.startupGrantAmount}><Txt size="big" bold>{formatLargeNumber(amounts.startupGrantAmount)}</Txt></ListRow>
                </PanelBody>
              </Panel>
            </Grid>
          </Grid>

          <Panel>
            <Datatable id="mpca-payment" data={_answers.get} loading={_answers.loading} columns={[
              {
                id: 'date',
                head: m.date,
                type: 'date',
                render: _ => {
                  return {
                    value: _.date,
                    label: formatDate(_.date)
                  }
                }
              },
              {
                id: 'taxId',
                head: m.taxID,
                renderQuick: _ => _.taxId
              },
              {
                id: 'taxIdImg',
                align: 'center',
                head: m.taxID,
                renderQuick: _ => map(_.taxIdFileURL, url =>
                  <TableImg url={getKoboImagePath(url.download_small_url)}/>
                )
              },
              {
                id: 'passportSerie',
                head: m.passportSerie,
                renderQuick: _ => _.passportSerie
              },
              {
                id: 'passportNum',
                head: m.passportNumber,
                renderQuick: _ => _.passportNum
              },
              {
                id: 'idFileImg',
                head: m.id,
                align: 'center',
                renderQuick: _ => map(_.idFileURL, url =>
                  <TableImg url={getKoboImagePath(url.download_small_url)}/>
                )
              },
              {id: 'status', head: m.status, renderQuick: _ => _.status},
              {id: 'lastName', head: m.lastName, renderQuick: _ => _.lastName},
              {id: 'firstName', head: m.firstName, renderQuick: _ => _.firstName},
              {id: 'patronyme', head: m.patronyme, renderQuick: _ => _.patronyme},
              {id: 'hhSize', head: m.hhSize, renderQuick: _ => _.hhSize},
              {id: 'phone', head: m.phone, renderQuick: _ => _.phone},
            ]}/>
          </Panel>
        </>
      )}
    </Page>
  )
}