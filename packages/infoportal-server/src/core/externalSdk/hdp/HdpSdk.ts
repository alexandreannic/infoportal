import * as mssql from 'mssql'
import {ConnectionPool} from 'mssql'
import {appConf, AppConf} from '../../conf/AppConf.js'

export class HdpSdk {
  static readonly fetchAiRiskEducation = async (config: AppConf = appConf) => {
    const pool = await mssql.connect({
      password: config.dbAzureHdp.password,
      user: config.dbAzureHdp.user,
      port: config.dbAzureHdp.port,
      database: config.dbAzureHdp.schema,
      server: config.dbAzureHdp.host,
    })
    const sql = await pool.connect()
    return await sql.query`
        SELECT *
        FROM external_migrate.undp_rmm_re_direct_session
    `
  }

  constructor(connector: ConnectionPool) {}
}
