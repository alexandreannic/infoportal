import {useAppSettings} from '@/core/context/ConfigContext.js'
import {useQuery} from '@tanstack/react-query'
import {Api} from '@infoportal/api-sdk'
import {queryKeys} from '@/core/query/query.index.js'

export class UseQueryFormActionLog {
  static search(params: Api.Form.Action.Log.Payload.Search) {
    const {apiv2} = useAppSettings()
    return useQuery({
      queryKey: queryKeys.formActionLog(params.workspaceId),
      queryFn: async () => apiv2.form.action.log.search(params),
    })
  }
}
