import {useKoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {useEffect, useMemo} from 'react'
import {KeyOf} from '@axanc/ts-utils'
import {Kobo} from 'kobo-sdk'

export const useKoboColumnDef = <T extends Record<string, any>>({
  formId,
  columnName,
}: {
  formId: Kobo.FormId
  columnName: KeyOf<T>
}) => {
  const ctx = useKoboSchemaContext()
  useEffect(() => {
    ctx.fetchById(formId)
  }, [formId])

  return useMemo(() => {
    const schema = ctx.byId[formId]?.get
    return {
      loading: ctx.byId[formId]?.loading,
      schema,
      columnDef: schema?.helper.questionIndex[columnName as string],
    }
  }, [ctx.byId, formId, columnName])
}
