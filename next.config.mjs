import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypeKatex from "rehype-katex";
import remarkMath from 'remark-math';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow .js, .jsx, .ts, .tsx, .md, and .mdx files as pages/components
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex]
  }
})

export default withMDX(nextConfig)
