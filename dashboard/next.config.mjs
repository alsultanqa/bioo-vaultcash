const isPages = process.env.GITHUB_PAGES === 'true';
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';
const basePath = isPages && repo ? `/${repo}` : '';
/** @type {import('next').NextConfig} */
const nextConfig = { output: 'export', basePath, images: { unoptimized: true }, reactStrictMode: true };
export default nextConfig;
