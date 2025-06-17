import {useFormSchema} from '@/core/query/useFormSchema'
import {KeyOf} from '@axanc/ts-utils'
import {Kobo} from 'kobo-sdk'
import {useMemo} from 'react'

export const useKoboColumnDef = <T extends Record<string, any>>({
  formId,
  columnName,
}: {
  formId: Kobo.FormId
  columnName: KeyOf<T>
}) => {
  const querySchema = useFormSchema(formId)

  return useMemo(() => {
    const schema = querySchema.data
    return {
      loading: querySchema.isLoading,
      schema,
      columnDef: schema?.helper.questionIndex[columnName as string],
    }
  }, [formId, columnName])
}
