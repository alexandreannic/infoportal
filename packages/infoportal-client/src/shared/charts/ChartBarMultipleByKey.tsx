import {ChartBarMultipleBy, ChartBarMultipleByProps} from '@/shared/charts/ChartBarMultipleBy'
import {KeyOfType} from '@axanc/ts-utils'

export const ChartBarMultipleByKey = <
  D extends Record<string, any>,
  R extends string | undefined,
  O extends Record<NonNullable<R>, string>,
  K extends KeyOfType<D, string[] | undefined>,
>({
  property,
  by,
  ...props
}: Omit<ChartBarMultipleByProps<D, R, O>, 'by'> & {
  property: K
  by?: (_: D[K]) => R[] | undefined
}) => {
  return <ChartBarMultipleBy by={(_) => (by ? by(_[property]) : _[property])} {...props} />
}
