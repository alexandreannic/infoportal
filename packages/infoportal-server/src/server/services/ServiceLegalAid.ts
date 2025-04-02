import {LegalaidSdk} from '../../core/externalSdk/legalaid/LegalaidSdk.js'
import {seq} from '@axanc/ts-utils'
import {Period} from 'infoportal-common'

interface Filters extends Partial<Period> {}

export class ServiceLegalAid {
  constructor(private sdk: LegalaidSdk) {}

  readonly getStats = async ({start, end}: Filters) => {
    const offices = await this.sdk.fetchOfficesAll().then((_) => Object.values(_).flatMap((_) => _.id))

    const groups$ = this.sdk
      .fetchGroupsByOffices({
        offices,
        start,
        end,
      })
      .then((_) => seq(_.data).sum((_) => _.women + _.men))

    const individuals$ = await this.sdk
      .fetchBeneficiariesByOffices({
        offices,
        start,
        end,
      })
      .then((_) => _.data.length)

    return Promise.all([groups$, individuals$]).then(([group, individuals]) => ({
      individuals,
      group,
      printedMaterial: 50,
      localAidPartner: 23,
    }))
  }
}
