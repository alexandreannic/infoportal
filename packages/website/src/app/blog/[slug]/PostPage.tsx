'use client'
import {Animate} from '@infoportal/client-core'

export const PostPage = ({contentHtml}: {contentHtml: string}) => {
  return (
    <Animate>
      <div dangerouslySetInnerHTML={{__html: contentHtml}} />
    </Animate>
  )
}
