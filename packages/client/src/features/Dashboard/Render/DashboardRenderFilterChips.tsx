import {useDashboardContext} from '@/features/Dashboard/DashboardContext'
import {Obj} from '@axanc/ts-utils'
import {Chip} from '@mui/material'

export const DashboardRenderFilterChips = () => {
  const filter = useDashboardContext(_ => _.filter.get.questions)
  const clearQuestion = useDashboardContext(_ => _.filter.clearQuestion)
  const schema = useDashboardContext(_ => _.schema)
  return (
    <>
      {Obj.keys(filter).map(qName => {
        const label = schema.translate.question(qName)
        return (
          <Chip
            variant="outlined"
            color="primary"
            key={qName}
            title={label}
            onDelete={() => clearQuestion(qName)}
            label={label}
            sx={{maxWidth: 220, mr: 0.5}}
          />
        )
      })}
    </>
  )
}
