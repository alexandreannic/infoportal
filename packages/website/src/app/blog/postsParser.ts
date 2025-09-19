import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {remark} from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'src/posts')

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory)
}

export type Post = {
  slug: string
  frontmatter: {
    date: string
    title: string
    coverPath: string
  }
  contentHtml: string
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = path.join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const {data, content} = matter(fileContents)

  const processedContent = await remark().use(html).process(content)
  const contentHtml = processedContent.toString()

  return {
    slug: realSlug,
    frontmatter: data as any,
    contentHtml,
  }
}

export async function getAllPosts() {
  const slugs = getPostSlugs()
  const posts = await Promise.all(slugs.map(slug => getPostBySlug(slug)))

  return posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
}
