import {Skeleton} from '@mui/material'
import {mapFor} from '@axanc/ts-utils'
import React, {memo} from 'react'

export const DatatableSkeleton = memo(() => {
  return (
    <table className="table borderY">
      <tbody>
        {mapFor(20, (i) => (
          <tr className="tr" key={i}>
            {mapFor(14, (i) => (
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
