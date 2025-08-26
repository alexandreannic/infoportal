import React from 'react'
import {Box, Icon, useTheme} from '@mui/material'
import {useDatabaseKoboTableContext} from '@/features/Form/Database/DatabaseContext'
import {useI18n} from '@/core/i18n'
import {Core} from '@/shared'

export const DatabaseGroupDisplayInput = (props: Core.BtnProps) => {
  const t = useTheme()
  const {m} = useI18n()
  const {schema, groupDisplay} = useDatabaseKoboTableContext()
  return (
    <Core.PopoverWrapper
      content={() => (
        <Box sx={{p: 1, minWidth: 120, width: 320}}>
          <Core.Txt color="hint" sx={{mb: 0.5}} fontSize="small" block>
            {m._koboDatabase.repeatAs}
          </Core.Txt>
          <Core.RadioGroup
            dense
            value={groupDisplay.get.repeatAs}
            onChange={_ => groupDisplay.setProperty('repeatAs', _)}
          >
            <Core.RadioGroupItem value={null} title={m._koboDatabase.repeatDont} />
            <Core.RadioGroupItem value="rows" title={m._koboDatabase.repeatAsRows} />
            <Core.RadioGroupItem value="columns" title={m._koboDatabase.repeatAsColumn} />
          </Core.RadioGroup>
          {groupDisplay.get.repeatAs === 'rows' && (
            <>
              <Core.Txt color="hint" sx={{mt: 1.5, mb: 0.5}} fontSize="small" block>
                {m._koboDatabase.repeatAsQuestionName}
              </Core.Txt>
              <Core.SelectSingle
                value={groupDisplay.get.repeatGroupName}
                renderValue={_ => schema.translate.question(_)!}
                onChange={_ => groupDisplay.setProperty('repeatGroupName', _ ?? undefined)}
                options={schema.helper.group.search({depth: 1}).map(_ =>
                  Core.SelectItem({
                    value: _.name,
                    title: schema.translate.question(_.name),
                    desc: _.name,
                  }),
                )}
              />
            </>
          )}
        </Box>
      )}
    >
      <Core.Btn
        variant="input"
        color="inherit"
        children={<Icon sx={{transform: 'rotate(180deg)', marginRight: '-8px'}}>move_up</Icon>}
        endIcon={<Icon sx={{color: t.vars.palette.text.secondary}}>arrow_drop_down</Icon>}
        {...props}
      />
    </Core.PopoverWrapper>
  )
}
