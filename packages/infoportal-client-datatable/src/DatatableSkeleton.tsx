import {Skeleton} from '@mui/material'
import {mapFor} from '@axanc/ts-utils'
import React, {memo} from 'react'

export const DatatableSkeleton = memo(({rows = 20, columns = 10}: {rows?: number; columns?: number}) => {
  return (
    <table className="table borderY" style={{width: '100%'}}>
      <tbody>
        {mapFor(rows, i => (
          <tr className="tr" key={i}>
            {mapFor(Math.min(columns, 14), i => (
              <td className="td" key={i}>
                <Skeleton sx={{mx: 1}} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
})
