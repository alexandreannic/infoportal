import {UUID} from 'infoportal-common'

export namespace Legalaid {
  export type ColumnType = 'longText' | 'number' | 'ratioGroup' | 'select' | 'text' | 'datePicker'

  export interface PaginateRequest {
    limit?: number
    skip?: number
  }

  export interface PaginateResult<T = Record<string, any>> {
    cols: Record<UUID, {name: string; type: ColumnType}>
    data: T[]
    total: number
  }

  type Role = 'admin' | 'inner'

  interface Office {
    _id: UUID
    city: string
  }

  interface User {
    _id: UUID
    login: string
    name: string
    role: Role
  }

  export interface Poll {
    createdAt: Date
    createdBy: User
    description: string
    name: string
    office: Office
    pollFields: UUID[]
    status: 'poll'
    updatedAt: Date
    visibility: 'public'
    _id: UUID
  }

  export interface Beneficiary {
    _id: UUID
    date: Date
    createdBy: User
    createdAt: Date
    updatedAt: Date
  }

  export interface Gender<T> {
    men: T
    women: T
  }

  export interface BeneficiaryGroup extends Beneficiary, Gender<number> {}

  export class Config {
    static readonly offices = {
      // 'DRC avocacy and LAU meetings': {
      //   id: '619f8bea439d3c04f1aba782',
      //   email: 'olha.bushtarenko@drc.ngo',
      // },
      DRC: {
        id: '624c4e21a397c105f1cdb9cf',
        email: 'olha.bushtarenko@drc.ngo',
      },
      БВПД: {
        // FSLAC - Free Secondary Legal aid Centre
        id: '625ec672a397c105f1cdbbda',
        email: 'olha.bushtarenko@drc.ngo',
      },
      // 'Caritas Mariupol FCDO': {
      //   id: '626bbd2aa397c105f1cdc0eb',
      //   email: 'olha.bushtarenko@drc.ngo',
      // },
      'ECHO 2022 NGO Partners': {
        id: '629659cda397c105f1cdcbb0',
        email: 'olha.bushtarenko@drc.ngo',
      },
      'LAP-2': {
        id: '62ea4b01a397c105f1cde165',
        email: 'olha.bushtarenko@drc.ngo',
      },
      'BHA 2022 NGO Partner': {
        id: '63483018b0bc18055cf0856c',
        email: 'olha.bushtarenko@drc.ngo',
      },
    }
  }
}
