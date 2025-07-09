import {appConfig} from '@/conf/AppConfig'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useI18n} from '@/core/i18n'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {DatabaseTable} from '@/features/Database/KoboTable/DatabaseKoboTable'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {Icon, Tab, Tabs} from '@mui/material'
import {useEffect, useMemo} from 'react'
import {useLocation, useParams} from 'react-router'
import {NavLink, Outlet, useNavigate} from 'react-router-dom'
import * as yup from 'yup'
import {useQueryForm, useQueryFormById} from '@/core/query/useQueryForm'
import {Page} from '@/shared'
import {appRouter} from '@/Router'
import {Ip} from 'infoportal-api-sdk'

export const databaseUrlParamsValidation = yup.object({
  formId: yup.string().required(),
})

const useDefaultTabRedirect = ({workspaceId, formId}: {workspaceId: Ip.Uuid; formId: Ip.FormId}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const querySchema = useQuerySchema({formId, workspaceId})
  useEffect(() => {
    if (querySchema.isLoading) return
    if (location.pathname !== appRouter.ws(workspaceId).database.form(formId).root) return
    if (querySchema.data) navigate(appRouter.ws(workspaceId).database.form(formId).answers)
    else navigate(appRouter.ws(workspaceId).database.form(formId).formCreator)
  }, [formId, querySchema.isLoading])
}

export const Database = () => {
  const {workspaceId} = useWorkspaceRouter()
  const {formId} = databaseUrlParamsValidation.validateSync(useParams())
  const {m} = useI18n()
  const {setTitle} = useLayoutContext()
  const {pathname} = useLocation()
  const {router} = useWorkspaceRouter()

  const querySchema = useQuerySchema({formId, workspaceId})
  const queryForm = useQueryForm(workspaceId)

  const currentForm = useQueryFormById({workspaceId, formId})

  useEffect(() => {
    if (currentForm.data) setTitle(m._koboDatabase.title(currentForm.data.name))
    return () => setTitle(m._koboDatabase.title())
  }, [queryForm.accessibleForms.data, formId])

  const schema = querySchema.data
  const repeatGroups = useMemo(() => {
    return schema?.helper.group.search().map(_ => _.name)
  }, [schema])

  useDefaultTabRedirect({workspaceId, formId})

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
          disabled={!schema}
        />
        <Tab
          icon={<Icon>edit</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={NavLink}
          value={router.database.form(formId).formCreator}
          to={router.database.form(formId).formCreator}
          label={m.form}
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
        <Tab
          icon={<Icon>settings</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={NavLink}
          value={router.database.form(formId).history}
          to={router.database.form(formId).history}
          label={m.settings}
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
      <Page
        width="full"
        sx={{p: 0, pb: 0, mb: 0, display: pathname === router.database.form(formId).answers ? 'block' : 'none'}}
      >
        <DatabaseTable workspaceId={workspaceId} form={currentForm.data} formId={formId} />
      </Page>
      <Outlet />
    </>
  )
}
