/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
    // Enable standalone output for Vercel
    output: 'standalone',
}

module.exports = nextConfig
