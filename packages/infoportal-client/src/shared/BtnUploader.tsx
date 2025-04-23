// import * as React from 'react'
import {useRef, useState} from 'react'
import {Avatar, Box, ButtonProps, Chip, CircularProgress, Icon} from '@mui/material'
import {makeSx} from '@/core/theme'
import {IpBtn} from './Btn'

const sx = makeSx({
  doc_icon: {
    color: (t) => t.palette.text.secondary,
    fontSize: (t) => t.typography.subtitle1.fontSize,
  },
})

interface Document {
  permalink: string
  name: string
}

interface Messages {
  loading: string
  upload: string
  invalidSize: string
}

export interface BtnUploaderProps extends Pick<ButtonProps, Exclude<keyof ButtonProps, 'classes'>> {
  document?: Document
  msg?: Messages
  uploading?: boolean
  maxUploadFileSize?: number
  onDelete: () => void
  onUpload: (f: File) => void
}

const defaultMsg = {
  loading: 'Loading...',
  upload: 'Upload',
  invalidSize: 'File is too big',
}

// TODO(Alex) Fix wierd typing issue (it works for <Btn>)
export const BtnUploader = ({
  document,
  uploading,
  msg = defaultMsg,
  onUpload,
  onDelete,
  maxUploadFileSize,
  loading,
  ...other
}: BtnUploaderProps) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const fileInputEl = useRef<HTMLInputElement>(null)

  const openFileSelection = () => {
    fileInputEl.current!.click()
  }

  const handleChange = (files: FileList | null) => {
    if (!files) {
      return
    }
    const file = files[0]
    if (maxUploadFileSize && file.size > maxUploadFileSize * 1024 * 1024) {
      setErrorMessage(msg.invalidSize)
      return
    }
    onUpload(file)
  }

  const clear = () => {
    onDelete()
  }

  const renderBody = () => {
    if (uploading) {
      return (
        <Chip
          sx={{
            color: (t) => t.palette.text.disabled,
            position: 'relative',
          }}
          label={msg.loading}
          avatar={
            <Avatar style={{position: 'initial'}}>
              <CircularProgress
                size={32}
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  left: 1,
                  bottom: 0,
                }}
              />
              <Icon sx={sx.doc_icon}>insert_drive_file</Icon>
            </Avatar>
          }
        />
      )
    } else {
      if (document) {
        return (
          <Chip
            label={document.name}
            onDelete={clear}
            onClick={() => window.open(document.permalink, '_blank')}
            avatar={
              <Avatar>
                <Icon sx={sx.doc_icon}>insert_drive_file</Icon>
              </Avatar>
            }
          />
        )
      } else {
        return (
          <IpBtn
            color="primary"
            onClick={openFileSelection}
            icon="file_upload"
            loading={loading ?? undefined}
            {...other}
          >
            {msg.upload}
            <input
              style={{display: 'none'}}
              type="file"
              ref={fileInputEl}
              onChange={(e) => handleChange(e.target.files)}
            />
          </IpBtn>
        )
      }
    }
  }

  return (
    <Box
      sx={{
        minHeight: 40,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {renderBody()}
      {errorMessage && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            ml: 1,
            color: (t) => t.palette.error.main,
            py: 1,
            px: 2,
            borderRadius: '2px',
          }}
        >
          <Icon sx={{mr: 1}}>warning</Icon>
          {errorMessage}
          <Icon
            sx={{
              ml: 1,
              cursor: 'pointer',
            }}
            onClick={() => setErrorMessage('')}
          >
            clear
          </Icon>
        </Box>
      )}
    </Box>
  )
}
