import {KeyOfType} from '@axanc/ts-utils'
import {ChartBarBy, ChartBarByProps} from './ChartBarBy.js'
type ChartBarByKeyProps<D extends Record<string, any>, R extends string> = Omit<
  ChartBarByProps<D, R>,
  'by' | 'multiple'
> &
  (
    | {
        multiple: true
        property: KeyOfType<D, string[] | undefined>
      }
    | {
        multiple?: false | undefined
        property: KeyOfType<D, string | undefined>
      }
  )

export const ChartBarByKey = <D extends Record<string, any>, R extends string>({
  property,
  ...props
}: ChartBarByKeyProps<D, R>) => {
  return <ChartBarBy by={_ => (_ as any)[property]} {...(props as any)} />
}
