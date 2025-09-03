'use client'
import {Post} from '@/app/blog/postsParser'
import {Box, SxProps, Typography, useTheme} from '@mui/material'
import Link from 'next/link'

export const blogListItemHeight = 140

export const BlogListItem = ({
  post,
  animate,
  onClick,
  sx,
}: {
  sx?: SxProps
  onClick?: (e: any) => void
  animate?: boolean
  post: Post
}) => {
  const t = useTheme()
  return (
    <Box
      component="li"
      sx={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
        ...sx,
      }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Box
          onClick={onClick}
          sx={{
            height: blogListItemHeight,
            position: 'relative',
            background: `url(${post.frontmatter.coverPath})`,
            backgroundSize: 'cover',
            borderRadius: t.vars.shape.borderRadius,
            overflow: 'hidden',
            color: 'white',
            transition: t.transitions.create('all'),
            '&:hover': animate
              ? {
                  transform: 'scale(1.02)',
                  boxShadow: t.shadows[4],
                }
              : {},
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              padding: t.vars.spacing,
              background: 'rgba(0,0,0,.5)',
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              backdropFilter: 'blur(1.5px)',
            }}
          >
            <div>
              <Typography component="h3" fontSize="1.4em" fontWeight="700">
                {post.frontmatter.title}
              </Typography>
              {post.frontmatter.date}
            </div>
          </Box>
        </Box>
      </Link>
    </Box>
  )
}
