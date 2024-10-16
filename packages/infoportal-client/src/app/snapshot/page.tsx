'use client'
import {Page} from '@/shared/Page'
import {useI18n} from '@/core/i18n'
import Link from 'next/link'
import {appFeaturesIndex} from '@/features/appFeatureId'
import {Layout} from '@/shared/Layout'
import {List, ListItem, ListItemText} from '@mui/material'

const Page = () => {
  const {m} = useI18n()
  const path = (route: string) => appFeaturesIndex.snapshot.path + '/' + route
  return (
    <Layout title={m.snapshot}>
      <Page>
        <List>
          <ListItem>
            <Link href={path('protection-monitoring-echo')}>
              <ListItemText primary="Protection Monitoring ECHO"/>
            </Link>
          </ListItem>
          <ListItem>
            <Link href={path('protection-monitoring-nn2')}>
              <ListItemText primary="Protection Monitoring NN 2"/>
            </Link>
          </ListItem>
          <ListItem>
            <Link href={path('protection-monitoring-gbv-survey')}>
              <ListItemText primary="Protection Monitoring GBV Survey"/>
            </Link>
          </ListItem>
          <ListItem>
            <Link href={path('meta')}>
              <ListItemText primary="Meta"/>
            </Link>
          </ListItem>
        </List>
      </Page>
    </Layout>
  )
}

export default Page