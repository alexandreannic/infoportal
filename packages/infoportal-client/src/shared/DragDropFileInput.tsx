import {Box, Typography, Paper, Icon, useTheme, Chip, BoxProps, Alert} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import {useCallback, useState} from 'react'
import {useI18n} from '@/core/i18n'
import {Txt} from '@/shared/Txt'
import {styleUtils} from '@/core/theme'

export function DragDropFileInput({
  onFilesSelected,
  onClear,
  accept = '.xlsx, .xls',
  multiple = false,
  error,
  sx,
  value,
}: {
  value?: FileList
  error?: string
  onFilesSelected: (files: FileList) => void
  onClear?: () => void
  accept?: string
  multiple?: boolean
} & Pick<BoxProps, 'sx'>) {
  const t = useTheme()
  const {m} = useI18n()
  const [isDragActive, setIsDragActive] = useState(false)
  const [fileNames, setFileNames] = useState<string[]>([])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragActive(false)
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFilesSelected(e.dataTransfer.files)
        setFileNames(Array.from(e.dataTransfer.files).map(f => f.name))
        e.dataTransfer.clearData()
      }
    },
    [onFilesSelected],
  )

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(e.target.files)
      setFileNames(Array.from(e.target.files).map(f => f.name))
    }
  }

  return (
    <Box
      sx={{
        borderRadius: t.shape.borderRadius + 'px',
        p: 3,
        border: '2px dashed',
        backgroundColor: isDragActive ? t.palette.primary.light : styleUtils(t).color.inputBack,
        borderColor: error ? 'primary.error.main' : isDragActive ? 'primary.main' : t.palette.divider,
        textAlign: 'center',
        cursor: 'pointer',
        transition: '0.2s',
        ...sx,
      }}
      onDragEnter={() => setIsDragActive(true)}
      onDragLeave={() => setIsDragActive(false)}
      onDragOver={e => {
        e.preventDefault()
        setIsDragActive(true)
      }}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <Icon sx={{fontSize: 50}} color="action">
        upload_file
      </Icon>
      <Txt size="big" mt={1} block>
        {m.dragdropTitle}
      </Txt>
      <Txt color="hint">{accept}</Txt>

      <input id="file-input" type="file" hidden accept={accept} multiple={multiple} onChange={handleFileInputChange} />

      {fileNames.length > 0 && (
        <Box mt={2}>
          {fileNames.map((name, idx) => (
            <Chip
              key={idx}
              icon={<Icon>description</Icon>}
              label={name}
              onDelete={
                onClear
                  ? () => {
                      const el = document.getElementById('file-input') as HTMLInputElement
                      if (el) el.value = ''
                      onClear()
                      setFileNames([])
                    }
                  : undefined
              }
            />
          ))}
        </Box>
      )}
      {error && <Alert color="error">{error}</Alert>}
    </Box>
  )
}
