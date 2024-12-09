import {MenuItem} from '@mui/material'
import React, {useRef} from 'react'
import {IpIconBtn, PopoverWrapper} from '@/shared'

interface DatabaseImportBtnProps {
  onUploadNewData: (file: File) => void;
  onUpdateExistingData: (file: File) => void;
  loading?: boolean;
}

export const DatabaseImportBtn: React.FC<DatabaseImportBtnProps> = ({
  onUploadNewData,
  onUpdateExistingData,
  loading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleMenuClick = (selectedAction: 'create' | 'update', close: () => void) => {
    close()
    if (fileInputRef.current) {
      fileInputRef.current.dataset.action = selectedAction
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && fileInputRef.current) {
      const action = fileInputRef.current.dataset.action
      if (action === 'create') {
        onUploadNewData(file)
      } else if (action === 'update') {
        onUpdateExistingData(file)
      }
      event.target.value = ''
    }
  }

  return (
    <>
      <PopoverWrapper content={(close) => (
        <>
          <MenuItem onClick={() => handleMenuClick('create', close)}>Upload New Data</MenuItem>
          <MenuItem onClick={() => handleMenuClick('update', close)}>Update Existing Data</MenuItem>
        </>
      )}>
        <IpIconBtn
          loading={loading}
          children="upload"
          tooltip="Import Data"
        />
      </PopoverWrapper>
      <input
        type="file"
        ref={fileInputRef}
        accept=".xls,.xlsx"
        style={{display: 'none'}}
        onChange={handleFileChange}
      />
    </>
  )
}