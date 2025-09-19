import {HttpError} from 'infoportal-api-sdk'

export namespace AccessError {
  export class InvalidFeatureId extends HttpError.BadRequest {
    constructor() {
      super('invalid_feature_id')
    }
  }
}
