import {IpBtn, IpBtnProps, PopoverWrapper, Txt} from '@/shared'
import React from 'react'
import {Box, Icon, useTheme} from '@mui/material'
import {ScRadioGroup, ScRadioGroupItem} from '@/shared/RadioGroup'
import {useDatabaseKoboTableContext} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {ipSelectItem, IpSelectSingle} from '@/shared/Select/SelectSingle'
import {useI18n} from '@/core/i18n'

export const DatabaseGroupDisplayInput = (props: IpBtnProps) => {
  const t = useTheme()
  const {m} = useI18n()
  const {schema, groupDisplay} = useDatabaseKoboTableContext()
  return (
    <PopoverWrapper
      content={() => (
        <Box sx={{p: 1, minWidth: 120, width: 320}}>
          <Txt color="hint" sx={{mb: 0.5}} fontSize="small" block>
            {m._koboDatabase.repeatAs}
          </Txt>
          <ScRadioGroup
            dense
            value={groupDisplay.get.repeatAs}
            onChange={(_) => groupDisplay.setProperty('repeatAs', _)}
          >
            <ScRadioGroupItem value={null} title={m._koboDatabase.repeatDont} />
            <ScRadioGroupItem value="rows" title={m._koboDatabase.repeatAsRows} />
            <ScRadioGroupItem value="columns" title={m._koboDatabase.repeatAsColumn} />
          </ScRadioGroup>
          {groupDisplay.get.repeatAs === 'rows' && (
            <>
              <Txt color="hint" sx={{mt: 1.5, mb: 0.5}} fontSize="small" block>
                {m._koboDatabase.repeatAsQuestionName}
              </Txt>
              <IpSelectSingle
                value={groupDisplay.get.repeatGroupName}
                renderValue={(_) => schema.translate.question(_)!}
                onChange={(_) => groupDisplay.setProperty('repeatGroupName', _ ?? undefined)}
                options={schema.helper.group.search({depth: 1}).map((_) =>
                  ipSelectItem({
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
      <IpBtn
        variant="input"
        color="inherit"
        children={<Icon sx={{transform: 'rotate(180deg)', marginRight: '-8px'}}>move_up</Icon>}
        endIcon={<Icon sx={{color: t.palette.text.secondary}}>arrow_drop_down</Icon>}
        {...props}
      />
    </PopoverWrapper>
  )
}
