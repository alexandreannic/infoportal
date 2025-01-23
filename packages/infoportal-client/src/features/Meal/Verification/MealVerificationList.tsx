import React, {useEffect} from 'react'
import {Page} from '@/shared/Page'
import {Panel} from '@/shared/Panel'
import {useI18n} from '@/core/i18n'
import {Avatar, Box, BoxProps, Icon, useTheme} from '@mui/material'
import {TableIconBtn} from '@/features/Mpca/MpcaData/TableIcon'
import {NavLink} from 'react-router-dom'
import {IpBtn} from '@/shared/Btn'
import {Modal, Txt} from '@/shared'
import {useAsync} from '@/shared/hook/useAsync'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useSession} from '@/core/Session/SessionContext'
import {Kobo} from 'kobo-sdk'
import {KoboIndex} from 'infoportal-common'
import {AppFeatureId} from '@/features/appFeatureId'
import {databaseIndex} from '@/features/Database/databaseIndex'
import Link from 'next/link'
import {DatatableUtils} from '@/shared/Datatable/util/datatableUtils'
import {IpSelectSingle} from '@/shared/Select/SelectSingle'
import {MealVerificationStatus} from '@/core/sdk/server/mealVerification/MealVerification'
import {mealIndex} from '@/features/Meal/Meal'
import {useMealVerificationContext} from '@/features/Meal/Verification/MealVerificationContext'
import {mealVerificationActivitiesIndex} from '@/features/Meal/Verification/mealVerificationConfig'
import {Datatable} from '@/shared/Datatable/Datatable'

export const MealVerificationLinkToForm = ({
  koboFormId,
  sx,
}: {
  koboFormId: Kobo.FormId
} & Pick<BoxProps, 'sx'>) => {
  const {conf} = useAppSettings()
  return (
    <Link
      target="_blank"
      href={conf.linkToFeature(AppFeatureId.kobo_database, databaseIndex.siteMap.database.absolute(koboFormId))}
    >
      <Txt link sx={{display: 'flex', alignItems: 'center', ...sx}}>
        <Icon fontSize="inherit" sx={{mr: 0.5}}>
          open_in_new
        </Icon>
        {KoboIndex.searchById(koboFormId)?.translation}
      </Txt>
    </Link>
  )
}

export const MealVerificationList = () => {
  const ctx = useMealVerificationContext()
  const {api} = useAppSettings()
  const {session} = useSession()
  const asyncRemove = useAsync(api.mealVerification.remove)
  const {m, formatDateTime} = useI18n()
  const t = useTheme()
  useEffect(() => {
    ctx.fetcherVerifications.fetch({force: true, clean: false})
  }, [])

  return (
    <Page width="full">
      <Panel>
        <Datatable
          header={
            <>
              <NavLink to={mealIndex.siteMap.verification.form}>
                <IpBtn variant="contained" icon="add">
                  {m._mealVerif.newRequest}
                </IpBtn>
              </NavLink>
            </>
          }
          id="meal-verification-request"
          data={ctx.fetcherVerifications.get}
          loading={ctx.fetcherVerifications.loading}
          columns={[
            {
              id: 'validation',
              head: m.validation,
              width: 0,
              type: 'select_one',
              render: (row) => {
                return {
                  tooltip: null,
                  value: row.status ?? DatatableUtils.blank,
                  option: row.status ? m[row.status!] : DatatableUtils.blank,
                  label: (
                    <>
                      <IpSelectSingle
                        disabled={!ctx.access.admin}
                        value={row.status}
                        options={[
                          {
                            children: (
                              <Icon sx={{color: t.palette.success.main}} title={m.Approved}>
                                check_circle
                              </Icon>
                            ),
                            value: MealVerificationStatus.Approved,
                          },
                          {
                            children: (
                              <Icon sx={{color: t.palette.error.main}} title={m.Rejected}>
                                error
                              </Icon>
                            ),
                            value: MealVerificationStatus.Rejected,
                          },
                          {
                            children: (
                              <Icon sx={{color: t.palette.warning.main}} title={m.Pending}>
                                schedule
                              </Icon>
                            ),
                            value: MealVerificationStatus.Pending,
                          },
                        ]}
                        onChange={(e) => {
                          ctx.asyncUpdate.call(row.id, e ?? undefined)
                        }}
                      />
                    </>
                  ),
                }
              },
            },
            {
              type: 'string',
              id: 'name',
              head: m.name,
              style: () => ({fontWeight: t.typography.fontWeightBold}),
              renderQuick: (_) => _.name,
            },
            {
              type: 'string',
              id: 'desc',
              head: m.description,
              style: () => ({color: t.palette.text.secondary}),
              renderQuick: (_) => _.desc,
            },
            {
              type: 'date',
              id: 'createdAt',
              head: m.createdAt,
              render: (_) => {
                return {
                  label: formatDateTime(_.createdAt),
                  value: _.createdAt,
                }
              },
            },
            {
              type: 'select_one',
              id: 'createdBy',
              head: m.createdBy,
              render: (_) => {
                return {
                  option: _.createdBy,
                  value: _.createdBy,
                  label: (
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                      <Avatar sx={{width: 22, height: 22, mr: 1}}>
                        <Icon fontSize="small">person</Icon>
                      </Avatar>
                      {_.createdBy}
                    </Box>
                  ),
                }
              },
            },
            {
              type: 'string',
              id: 'filters',
              head: m.filters,
              renderQuick: (_) => JSON.stringify(_.filters),
            },
            {
              type: 'select_one',
              id: 'activity',
              head: m._mealVerif.activityForm,
              render: (_) => {
                return {
                  option: KoboIndex.searchById(mealVerificationActivitiesIndex[_.activity].registration.koboFormId)
                    ?.translation,
                  value: KoboIndex.searchById(mealVerificationActivitiesIndex[_.activity].registration.koboFormId)
                    ?.translation,
                  label: (
                    <MealVerificationLinkToForm
                      koboFormId={mealVerificationActivitiesIndex[_.activity].registration.koboFormId}
                    />
                  ),
                }
              },
            },
            {
              type: 'select_one',
              id: 'verification',
              head: m._mealVerif.verificationForm,
              render: (_) => {
                return {
                  option: KoboIndex.searchById(mealVerificationActivitiesIndex[_.activity].verification.koboFormId)
                    ?.translation,
                  value: KoboIndex.searchById(mealVerificationActivitiesIndex[_.activity].verification.koboFormId)
                    ?.translation,
                  label: (
                    <MealVerificationLinkToForm
                      koboFormId={mealVerificationActivitiesIndex[_.activity].verification.koboFormId}
                    />
                  ),
                }
              },
            },
            {
              id: 'actions',
              head: '',
              width: 1,
              align: 'right',
              renderQuick: (_) => (
                <>
                  {session.admin && (
                    <Modal
                      title={m.confirmRemove}
                      onConfirm={(e, close) =>
                        asyncRemove.call(_.id).then(() => {
                          close()
                          ctx.fetcherVerifications.fetch({force: true, clean: false})
                        })
                      }
                      loading={asyncRemove.loading}
                    >
                      <TableIconBtn>delete</TableIconBtn>
                    </Modal>
                  )}
                  <NavLink to={mealIndex.siteMap.verification.data(_.id)}>
                    <TableIconBtn>chevron_right</TableIconBtn>
                  </NavLink>
                </>
              ),
            },
          ]}
        />
      </Panel>
    </Page>
  )
}
