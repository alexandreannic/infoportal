import {useI18n} from '@/core/i18n'
import {Fender} from '@/shared'
import {SidebarItem} from '@/shared/Layout/Sidebar'
import {Skeleton, useTheme} from '@mui/material'
import {useMemo, useState} from 'react'
import {useQueryForm} from '@/core/query/useQueryForm'
import {Ip} from 'infoportal-api-sdk'
import {mapFor, Seq, seq} from '@axanc/ts-utils'
import {SidebarItemProps} from '@/shared/Layout/Sidebar/SidebarItem.js'
import {UseQuerySmartDb} from '@/core/query/useQuerySmartDb.js'
import {Asset} from '@/shared/Asset.js'
import {AppSidebarFilters} from '@/core/layout/AppSidebarFilters.js'
import {AppSidebarAsset} from '@/core/layout/AppSidebarAsset.js'

export const AppSidebarAssets = ({workspaceId}: {workspaceId: Ip.WorkspaceId}) => {
  const {m} = useI18n()
  const t = useTheme()

  const queryForm = useQueryForm(workspaceId)
  const querySmartDb = UseQuerySmartDb.getAll(workspaceId)

  const assets: Seq<Asset> = useMemo(() => {
    if (!queryForm.accessibleForms.data || !querySmartDb.data) return seq()
    return seq([
      ...queryForm.accessibleForms.data.map(_ => {
        return {
          id: _.id,
          type: _.kobo ? Asset.Type.kobo : Asset.Type.internal,
          category: _.category,
          createdAt: _.createdAt,
          name: _.name,
          deploymentStatus: _.deploymentStatus,
        }
      }),
      ...querySmartDb.data.map(_ => {
        return {
          ..._,
          type: Asset.Type.smart,
        }
      }),
    ])
  }, [queryForm.accessibleForms.data, querySmartDb.data])

  const [filteredAssets, setFilteredAssets] = useState<Asset[]>(assets)

  const formItemSize: SidebarItemProps['size'] = assets.length > 19 ? 'tiny' : assets.length > 15 ? 'small' : 'normal'

  return (
    <>
      <AppSidebarFilters assets={assets} onFilterChanges={setFilteredAssets} sx={{mx: 0.5, mb: 1, mt: 0}} />
      {queryForm.accessibleForms.isLoading ? (
        mapFor(4, i => (
          <SidebarItem key={i} size={formItemSize}>
            <Skeleton sx={{width: 160, height: 30}} />
          </SidebarItem>
        ))
      ) : queryForm.accessibleForms.data?.length === 0 ? (
        <Fender
          type="empty"
          size="small"
          title={m._koboDatabase.noAccessToForm}
          sx={{mt: 2, color: t.vars.palette.text.disabled}}
        />
      ) : (
        filteredAssets.map(_ => (
          <AppSidebarAsset workspaceId={workspaceId} formItemSize={formItemSize} key={_.id} asset={_} />
        ))
      )}
    </>
  )
}

// function IconLinkedToKobo({sx, ...props}: IconProps) {
//   return (
//     <Icon fontSize="small" color="info" sx={{verticalAlign: 'middle', textAlign: 'center', ...sx}} {...props}>
//       plug_connect
//     </Icon>
//   )
// }
