import {Core} from '../index'
import {SchemaInspector} from '@infoportal/form-helper'

export const SelectLangIndex = ({
  inspector,
  ...props
}: Omit<Core.IpSelectSingleProps<number>, 'options' | 'hideNullOption'> & {
  inspector: SchemaInspector<any>
}) => {
  return (
    <Core.SelectSingle<number>
      {...props}
      hideNullOption
      options={[
        {children: 'XML', value: -1},
        ...inspector.schemaSanitized.translations.map((_, i) => ({children: _, value: i})),
      ]}
    />
  )
}
