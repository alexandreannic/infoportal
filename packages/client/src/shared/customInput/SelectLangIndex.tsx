import {Core} from '../index'
import {KoboSchemaHelper} from 'infoportal-common'

export const SelectLangIndex = ({
  schema,
  ...props
}: Omit<Core.IpSelectSingleProps<number>, 'options' | 'hideNullOption'> & {
  schema: KoboSchemaHelper.Bundle<any>
}) => {
  return (
    <Core.SelectSingle<number>
      {...props}
      hideNullOption
      options={[
        {children: 'XML', value: -1},
        ...schema.schemaSanitized.translations.map((_, i) => ({children: _, value: i})),
      ]}
    />
  )
}
