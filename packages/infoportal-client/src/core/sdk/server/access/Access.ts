import {Ip} from 'infoportal-api-sdk'

export interface AccessSum {
  read: boolean
  write: boolean
  admin: boolean
}

export class Access {
  static readonly toSum = (accesses: Ip.Form.Access[], admin?: boolean) => {
    return {
      admin: admin || !!accesses.find(_ => _.level === Ip.Form.Access.Level.Admin),
      write:
        admin || !!accesses.find(_ => _.level === Ip.Form.Access.Level.Write || _.level === Ip.Form.Access.Level.Admin),
      read:
        admin ||
        !!accesses.find(
          _ =>
            _.level === Ip.Form.Access.Level.Write ||
            _.level === Ip.Form.Access.Level.Admin ||
            _.level === Ip.Form.Access.Level.Read,
        ),
    }
  }
}
