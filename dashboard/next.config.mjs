/** @type {import('next').NextConfig} */
const isPages = process.env.GITHUB_PAGES === 'true';
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
/** When deploying to GitHub Pages, use basePath like /<repo> */
const basePath = isPages && repo ? `/${repo}` : '';
const nextConfig = {
  output: 'export',
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true
};
export default nextConfig;
