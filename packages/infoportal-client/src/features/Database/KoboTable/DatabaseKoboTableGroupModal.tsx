import {PanelHead} from '@/shared/Panel'
import {Txt} from '@/shared/Txt'
import React, {useMemo} from 'react'
import {Popover, useTheme} from '@mui/material'
import {getColumnBySchema} from '@/features/Database/KoboTable/columns/getColumnBySchema'
import {useI18n} from '@/core/i18n'
import {useDatabaseKoboTableContext} from '@/features/Database/KoboTable/DatabaseKoboContext'
import {Datatable} from '@/shared/Datatable/Datatable'
import {KoboAnswerFlat} from 'infoportal-common'

export const DatabaseKoboTableGroupModal = ({
  groupData,
  name,
  onClose,
  anchorEl,
}: {
  groupData: KoboAnswerFlat[],
  name: string
  onClose: () => void
  anchorEl: any,
}) => {
  const {m} = useI18n()
  const t = useTheme()
  const ctx = useDatabaseKoboTableContext()

  const columns = useMemo(() => {
    return getColumnBySchema({
      formId: ctx.form.id,
      data: groupData,
      m,
      theme: t,
      schema: ctx.schema.schemaHelper.groupSchemas[name],
      translateQuestion: ctx.schema.translate.question,
      translateChoice: ctx.schema.translate.choice,
      choicesIndex: ctx.schema.schemaHelper.choicesIndex,
      groupSchemas: ctx.schema.schemaHelper.groupSchemas,
    })
  }, [ctx.schema.schemaUnsanitized])

  return (
    <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={onClose}>
      <PanelHead>
        <Txt block sx={{maxWidth: 400}} truncate>{ctx.schema.translate.question(name)}</Txt>
      </PanelHead>
      <Datatable columns={columns} data={groupData} id={name}/>
    </Popover>
  )
}