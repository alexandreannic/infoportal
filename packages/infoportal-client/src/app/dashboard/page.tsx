'use client'
import {Page} from '@/shared/Page'
import {useI18n} from '@/core/i18n'
import Link from 'next/link'
import {appFeaturesIndex} from '@/features/appFeatureId'
import {Layout} from '@/shared/Layout'
import {List, ListItem, ListItemText} from '@mui/material'

const Page = () => {
  const {m} = useI18n()
  const path = (route: string) => appFeaturesIndex.protection.path + '/' + route
  return (
    <Layout title={m.dashboard}>
      <Page>
        <List>
          <ListItem>
            <Link href={path('protection-monitoring')}>
              <ListItemText primary="Protection Monitoring"/>
            </Link>
          </ListItem>
        </List>
      </Page>
    </Layout>
  )
}

export default Page