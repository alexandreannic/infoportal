import {AppError} from '../../helper/Errors.js'

export namespace WfPDeduplicationError {
  export class NoFileUploaded extends AppError.NoFileUploaded {
    constructor() {
      super('wfp_no_file_uploaded')
    }
  }
}
