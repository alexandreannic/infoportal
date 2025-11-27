import {useQuery} from '@tanstack/react-query'
import {useAppSettings} from '../../context/ConfigContext.js'
import {queryKeys} from '../query.index.js'
import {Api} from '@infoportal/api-sdk'

export class UseQuerySubmissionHistory {
  static search({formId, workspaceId}: {formId?: Api.FormId; workspaceId: Api.WorkspaceId}) {
    const {apiv2} = useAppSettings()
    return useQuery({
      enabled: !!formId,
      queryKey: queryKeys.submissionHistory(formId!),
      queryFn: () => apiv2.submission.history.search({workspaceId, formId: formId!}),
    })
  }
}
