import {useQuerySchema} from '@/core/query/useQuerySchema'
import {KeyOf} from '@axanc/ts-utils'
import {useMemo} from 'react'
import {Ip} from 'infoportal-api-sdk'

export const useKoboColumnDef = <T extends Record<string, any>>({
  workspaceId,
  formId,
  question,
}: {
  workspaceId: Ip.WorkspaceId
  formId: Ip.FormId
  question: KeyOf<T>
}) => {
  const querySchema = useQuerySchema({workspaceId, formId})

  return useMemo(() => {
    const schema = querySchema.data
    return {
      loading: querySchema.isLoading,
      schema,
      columnDef: schema?.helper.questionIndex[question as string],
    }
  }, [formId, question])
}
