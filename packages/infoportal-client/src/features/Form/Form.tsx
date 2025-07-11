import {appConfig} from '@/conf/AppConfig'
import {useWorkspaceRouter} from '@/core/query/useQueryWorkspace'
import {useI18n} from '@/core/i18n'
import {useQuerySchema} from '@/core/query/useQuerySchema'
import {useLayoutContext} from '@/shared/Layout/LayoutContext'
import {Icon, Tab, Tabs} from '@mui/material'
import {useEffect, useMemo} from 'react'
import {useLocation, useOutletContext, useParams} from 'react-router'
import {NavLink, Outlet, useNavigate} from 'react-router-dom'
import * as yup from 'yup'
import {useQueryFormById} from '@/core/query/useQueryForm'
import {appRouter} from '@/Router'
import {Ip} from 'infoportal-api-sdk'
import {KoboSchemaHelper} from 'infoportal-common'
import {Page} from '@/shared'

export const databaseUrlParamsValidation = yup.object({
  formId: yup.string().required(),
})

const useDefaultTabRedirect = ({workspaceId, formId}: {workspaceId: Ip.Uuid; formId: Ip.FormId}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const querySchema = useQuerySchema({formId, workspaceId})
  useEffect(() => {
    if (querySchema.isLoading) return
    if (location.pathname !== appRouter.ws(workspaceId).form.byId(formId).root) return
    if (querySchema.data) navigate(appRouter.ws(workspaceId).form.byId(formId).answers)
    else navigate(appRouter.ws(workspaceId).form.byId(formId).formCreator)
  }, [formId, querySchema.isLoading])
}

export type FormContext = {
  workspaceId: Ip.Uuid
  form: Ip.Form
  schema?: KoboSchemaHelper.Bundle
}

export const useFormContext = (): FormContext => useOutletContext<FormContext>()

export const Form = () => {
  const {workspaceId} = useWorkspaceRouter()
  const {formId} = databaseUrlParamsValidation.validateSync(useParams())
  const {m} = useI18n()
  const {setTitle} = useLayoutContext()
  const {pathname} = useLocation()
  const {router} = useWorkspaceRouter()

  const querySchema = useQuerySchema({formId, workspaceId})
  const queryForm = useQueryFormById({workspaceId, formId}).get

  useEffect(() => {
    if (queryForm.data) setTitle(m._koboDatabase.title(queryForm.data.name))
    return () => setTitle(m._koboDatabase.title())
  }, [queryForm.data, formId])

  const schema = querySchema.data
  const repeatGroups = useMemo(() => {
    return schema?.helper.group.search().map(_ => _.name)
  }, [schema])

  useDefaultTabRedirect({workspaceId, formId})

  const outlet = useMemo(() => {
    if (queryForm.isPending || querySchema.isPending) {
      return <Page width="full" loading={true} />
    }
    if (!queryForm.data) {
      return <>ERROR</>
    }
    const context: FormContext = {
      workspaceId,
      form: queryForm.data,
      schema: querySchema.data!,
    }
    return <Outlet context={context} />
  }, [queryForm.status, queryForm.data, querySchema.status, querySchema.data, workspaceId])

  return (
    <>
      <Tabs variant="scrollable" scrollButtons="auto" value={pathname}>
        <Tab
          icon={<Icon>{appConfig.icons.dataTable}</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={NavLink}
          value={router.form.byId(formId).answers}
          to={router.form.byId(formId).answers}
          label={m.data}
          disabled={!schema}
        />
        <Tab
          icon={<Icon>edit</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={NavLink}
          value={router.form.byId(formId).formCreator}
          to={router.form.byId(formId).formCreator}
          label={m.form}
        />
        <Tab
          icon={<Icon>lock</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={NavLink}
          value={router.form.byId(formId).access}
          to={router.form.byId(formId).access}
          disabled={!schema}
          label={m.access}
        />
        <Tab
          icon={<Icon>history</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={NavLink}
          value={router.form.byId(formId).history}
          to={router.form.byId(formId).history}
          label={m.history}
        />
        <Tab
          icon={<Icon>settings</Icon>}
          iconPosition="start"
          sx={{minHeight: 34, py: 1}}
          component={NavLink}
          value={router.form.byId(formId).settings}
          to={router.form.byId(formId).settings}
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
              value={router.form.byId(formId).group(_)}
              to={router.form.byId(formId).group(_)}
              label={schema.translate.question(_)}
            />
          ))}
      </Tabs>
      {outlet}
    </>
  )
}
