import {Core} from '@/shared'
import {DashboardHeader} from '@/shared/DashboardLayout/DashboardHeader'
import {Layout} from '@/shared/Layout/Layout'
import {Sidebar, SidebarItem} from '@/shared/Layout/Sidebar'
import {Page} from '@/shared/Page'
import {useSetState} from '@axanc/react-hooks'
import {map} from '@axanc/ts-utils'
import {Box, Collapse, LinearProgress, Typography} from '@mui/material'
import React, {ReactNode, useEffect, useState} from 'react'
import {useInView} from 'react-intersection-observer'

const dashboardHeaderId = 'aa-header-id'

const style = Core.makeSx({
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    pt: 1,
    background: 'none',
    marginTop: '-30px',
    paddingTop: '70px',
    mb: 2,
    transition: t => t.transitions.create('all'),
  },
  sectionShrinked: {
    mb: 0,
  },
  iconExpand: {
    transition: t => t.transitions.create('all'),
    ml: 1,
    color: t => t.vars.palette.text.disabled,
  },
  iconExpendShrinked: {
    transform: 'rotate(180deg)',
  },
})

type Section = {
  icon?: string
  name: string
  title: ReactNode
  component: () => React.JSX.Element
}

export const DashboardLayout = ({
  sections,
  header,
  action,
  loading = false,
  title,
  pageWidth = 1100,
  beforeSection,
  subTitle,
}: {
  pageWidth?: number
  action?: ReactNode
  loading: boolean
  title: string
  subTitle?: string
  header?: ReactNode
  beforeSection?: ReactNode
  sections?: Section[]
}) => {
  const [activeSection, setActiveSection] = useState(sections?.[0]?.name ?? '')
  const hiddenSections = useSetState()

  useEffect(() => {
    if (!sections) return
    if (sections.length === 0) return
  }, [sections])

  return (
    <>
      {loading && <LinearProgress sx={{position: 'fixed', top: 0, right: 0, left: 0}} />}
      <Layout
        header={
          <DashboardHeader action={action} header={header} title={title} subTitle={subTitle} id={dashboardHeaderId} />
        }
        sidebar={map(sections, _ => (
          <Sidebar
            elevation={null}
            headerId={dashboardHeaderId}
            showThemeToggle
            sx={{background: 'none', boxShadow: 'none'}}
          >
            {_.map(s => (
              <SidebarItem
                icon={s.icon}
                key={s.name}
                href={'#' + s.name}
                active={activeSection === s.name}
                onClick={() => {
                  document.getElementById(s.name)?.scrollIntoView({behavior: 'smooth'})
                }}
              >
                {s.title}
              </SidebarItem>
            ))}
          </Sidebar>
        ))}
      >
        <Page width={pageWidth} sx={{mb: 2}}>
          {beforeSection}
          {sections?.map(s => (
            <Section
              key={s.name}
              section={s}
              onToggleHidden={() => hiddenSections.toggle(s.name)}
              onVisible={() => setActiveSection(s.name)}
              hidden={hiddenSections.has(s.name)}
            />
          ))}
        </Page>
      </Layout>
    </>
  )
}

function Section({
  section,
  hidden,
  onToggleHidden,
  onVisible,
}: {
  onVisible: () => void
  hidden?: boolean
  onToggleHidden: () => void
  section: Section
}) {
  const {ref, inView} = useInView({
    threshold: 0.5,
  })

  React.useEffect(() => {
    if (inView) onVisible()
  }, [inView])

  return (
    <Box key={section.name} ref={ref}>
      <Typography
        id={section.name}
        variant="h2"
        sx={Core.combineSx(style.sectionTitle, hidden && style.sectionShrinked)}
      >
        {section.title}
        <Core.IconBtn
          children="expand_less"
          sx={Core.combineSx(style.iconExpand, hidden && style.iconExpendShrinked)}
          onClick={onToggleHidden}
        />
      </Typography>
      <Collapse in={!hidden}>{section.component()}</Collapse>
    </Box>
  )
}
