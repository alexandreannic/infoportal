import {Box, BoxProps, Skeleton} from '@mui/material'
import {mapFor} from '@axanc/ts-utils'
import React, {memo, useMemo} from 'react'

export const DatatableSkeleton = memo(
  ({rows = 20, columns = 10, style, className, ...props}: BoxProps & {rows?: number; columns?: number}) => {
    const cols = useMemo(() => {
      return mapFor(Math.min(columns, 14), _ => '1fr').join(' ')
    }, [columns])
    return (
      <Box {...props} className={'dt ' + (className ?? '')} style={{['--cols' as any]: cols, ...style}}>
        <div className="dtbody">
          {mapFor(rows, i => (
            <div className="dth" key={i}>
              {mapFor(Math.min(columns, 14), i => (
                <div className="dtd" key={i}>
                  <Skeleton sx={{mx: 1, width: '100%'}} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Box>
    )
  },
)
