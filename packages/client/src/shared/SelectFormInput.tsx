import {Ip} from 'infoportal-api-sdk'
import {UseQueryForm} from '@/core/query/useQueryForm'
import React, {useMemo, useState} from 'react'
import {Asset, AssetIcon, AssetType} from '@/shared/Asset'
import {AppSidebarFilters} from '@/core/layout/AppSidebarFilters'
import {DeploymentStatusIcon} from '@/shared/DeploymentStatus'
import {Core} from '.'

export function SelectFormInput({
  workspaceId,
  value,
  onChange,
}: {
  workspaceId: Ip.WorkspaceId
  value: Ip.FormId
  onChange: (_: Ip.FormId) => void
}) {
  const queryForms = UseQueryForm.getAccessibles(workspaceId)
  const assets = useMemo(() => {
    if (!queryForms.data) return []
    return queryForms.data.map(_ => ({..._, type: _.kobo ? AssetType.kobo : AssetType.internal}))
  }, [queryForms.data])

  const [filteredAsset, setFilteredAsset] = useState<Asset[]>(assets)
  return (
    <>
      {assets.length > 10 && <AppSidebarFilters assets={assets} onFilterChanges={setFilteredAsset} sx={{mb: 1}} />}
      <Core.RadioGroup<Ip.FormId> dense sx={{height: 300, overflowY: 'scroll'}} value={value} onChange={onChange}>
        {filteredAsset.map(_ => (
          <Core.RadioGroupItem
            hideRadio
            value={_.id}
            key={_.id}
            sx={{display: 'flex', alignItems: 'center'}}
            icon={<AssetIcon type={_.type} />}
            endContent={
              _.deploymentStatus &&
              _.deploymentStatus !== 'deployed' && <DeploymentStatusIcon status={_.deploymentStatus} />
            }
          >
            {_.name}
          </Core.RadioGroupItem>
        ))}
      </Core.RadioGroup>
    </>
  )
}
