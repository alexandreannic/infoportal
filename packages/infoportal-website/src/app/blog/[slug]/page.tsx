import {getAllPosts, getPostBySlug} from '@/app/blog/postsParser'
import Box from '@mui/material/Box'
import style from './PostPage.module.css'
import {BlogListItem} from '@/app/blog/BlogListItem'
import {PostPage} from '@/app/blog/[slug]/PostPage'

export default async function PostPagePage({params}: {params: {slug: string}}) {
  const {slug} = await params
  const post = await getPostBySlug(slug)

  return (
    <Box component="article" className={style.root}>
      <BlogListItem post={post} />
      <PostPage contentHtml={post.contentHtml} />
    </Box>
  )
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(p => ({slug: p.slug}))
}
