import React from 'react'
import {PageInfo} from './xform'

interface Props {
  pageInfo: PageInfo | null;
}

const PageIndicator = ({pageInfo}: Props) => {
  return (
    pageInfo && (
      <div>
        Page indicator: {(pageInfo.currentPage || 0) + 1}
        - {pageInfo.totalPages}
      </div>
    )
  )
}

export default PageIndicator
