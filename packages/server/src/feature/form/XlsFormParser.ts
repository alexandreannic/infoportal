import {Api} from '@infoportal/api-sdk'
import {execFile} from 'child_process'
import {promisify} from 'util'
import {XlsFormToSchema} from '@infoportal/form-helper'

const execFilePromise = promisify(execFile)

export class XlsFormParser {
  static readonly validateAndParse = async (filePath: string): Promise<Api.Form.Schema.Validation> => {
    type PyxResponse = Pick<Api.Form.Schema.Validation, 'code' | 'message' | 'warnings'>
    const {stdout, stderr} = await execFilePromise('python3', ['-m', 'pyxform.xls2xform', filePath, '--json'])
    const err: PyxResponse = stderr !== '' ? JSON.parse(stderr) : undefined
    const out: PyxResponse = stdout !== '' ? JSON.parse(stdout) : undefined
    const output = {...err, ...out}
    const status = output.code === 100 ? 'success' : err.code < 200 ? 'warning' : 'error'
    if (status === 'error') {
      return {status, ...output}
    }
    const schema = XlsFormToSchema.convert(filePath)
    return {...output, status, schema}
  }
}
