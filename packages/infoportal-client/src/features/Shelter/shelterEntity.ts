import {
  DrcOffice,
  KoboSubmissionFlat,
  OblastISO,
  OblastName,
  Person,
  Shelter_nta,
  Shelter_ta,
  ShelterNtaTags,
  ShelterTaPriceLevel,
  ShelterTaTags
} from 'infoportal-common'
import {Kobo} from 'kobo-sdk'

export interface ShelterEntity {
  ta?: KoboSubmissionFlat<Shelter_ta.T, ShelterTaTags> & {
    _price?: number | null
    _priceLevel?: ShelterTaPriceLevel
  }
  nta?: KoboSubmissionFlat<Shelter_nta.T, ShelterNtaTags>
  oblastIso?: OblastISO | ''
  oblast?: OblastName | ''
  office?: DrcOffice | ''
  id: Kobo.SubmissionId
  persons?: Person.Person[]
}

export class ShelterEntityHelper {


}
