import {getAllPosts} from '@/app/blog/postsParser'
import {SectionTitle} from '@/shared/SectionTitle/SectionTitle'
import style from './blog.module.css'
import {BlogListItemAnimator} from '@/app/blog/BlogListItemAnimator'
import {BlogListItem} from '@/app/blog/BlogListItem'

export default async function BlogPage() {
  const posts = await getAllPosts()
  return (
    <main className={style.root}>
      <SectionTitle>Blog</SectionTitle>
      <ul className={style.ul + ' ' + style.resetList}>
        {posts.map((post, i) => (
          <BlogListItemAnimator key={post.slug} position={i}>
            <BlogListItem animate post={post} />
          </BlogListItemAnimator>
        ))}
      </ul>
    </main>
  )
}
