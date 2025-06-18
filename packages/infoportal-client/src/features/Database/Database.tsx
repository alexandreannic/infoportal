import {appConfig} from '@/conf/AppConfig'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useI18n} from '@/core/i18n'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {useDatabaseContext} from '@/features/Database/DatabaseContext'
import {DatabaseTableRoute} from '@/features/Database/KoboTable/DatabaseKoboTable'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {Icon, Tab, Tabs} from '@mui/material'
import {useEffect, useMemo} from 'react'
import {useLocation, useParams} from 'react-router'
import {NavLink, Outlet} from 'react-router-dom'
import * as yup from 'yup'

export const databaseUrlParamsValidation = yup.object({
  formId: yup.string().required(),
})

export const Database = () => {
  const {formId} = databaseUrlParamsValidation.validateSync(useParams())
  const {m} = useI18n()
  const {setTitle} = useLayoutContext()

  const querySchema = useQuerySchema(formId)

  const ctx = useDatabaseContext()

  const {pathname} = useLocation()
  const {router} = useWorkspaceRouter()

  useEffect(() => {
    if (ctx.getForm(formId)?.name) setTitle(m._koboDatabase.title(ctx.getForm(formId)?.name))
    return () => setTitle(m._koboDatabase.title())
  }, [ctx._forms.get, formId])

  const schema = querySchema.data
  const repeatGroups = useMemo(() => {
    return schema?.helper.group.search().map(_ => _.name)
  }, [schema])

  return (
    <>
      <Tabs variant="scrollable" scrollButtons="auto" value={pathname}>
        <Tab
          icon={<Icon>{appConfig.icons.dataTable}</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={NavLink}
          value={router.database.form(formId).answers}
          to={router.database.form(formId).answers}
          label={m.data}
        />
        <Tab
          icon={<Icon>edit</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={NavLink}
          value={router.database.form(formId).formCreator}
          to={router.database.form(formId).formCreator}
          label={m.data}
        />
        <Tab
          icon={<Icon>lock</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={NavLink}
          value={router.database.form(formId).access}
          to={router.database.form(formId).access}
          label={m.access}
        />
        <Tab
          icon={<Icon>history</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={NavLink}
          value={router.database.form(formId).history}
          to={router.database.form(formId).history}
          label={m.history}
        />
        {schema &&
          repeatGroups?.map(_ => (
            <Tab
              icon={<Icon color="disabled">repeat</Icon>}
              iconPosition="start"
              key={_}
              sx={{minHeight: 34, py: 1}}
              component={NavLink}
              value={router.database.form(formId).group(_)}
              to={router.database.form(formId).group(_)}
              label={schema.translate.question(_)}
            />
          ))}
      </Tabs>
      <div style={{display: pathname === router.database.form(formId).answers ? 'block' : 'none'}}>
        <DatabaseTableRoute />
      </div>
      <Outlet />
    </>
  )
}
