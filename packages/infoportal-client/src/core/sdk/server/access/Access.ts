import {Ip} from 'infoportal-api-sdk'

export interface AccessSum {
  read: boolean
  write: boolean
  admin: boolean
}

export class Access {
  static toSum(accesses: Ip.Form.Access[], isAdmin = false): {admin: boolean; write: boolean; read: boolean} {
    const levels = new Set(accesses.map(a => a.level))
    const hasAny = (required: Ip.AccessLevel[]) => isAdmin || required.some(l => levels.has(l))
    return {
      admin: hasAny([Ip.AccessLevel.Admin]),
      write: hasAny([Ip.AccessLevel.Write, Ip.AccessLevel.Admin]),
      read: hasAny([Ip.AccessLevel.Read, Ip.AccessLevel.Write, Ip.AccessLevel.Admin]),
    }
  }
}
