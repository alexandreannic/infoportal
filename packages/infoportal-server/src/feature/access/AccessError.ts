import {AppError} from '../../helper/Errors.js'

export namespace AccessError {
  export class InvalidFeatureId extends AppError.BadRequest {
    constructor() {
      super('invalid_feature_id')
    }
  }
}
