/**
 * @type {import('next').NextConfig}
 */
const nextConfig: import('next').NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'campomaq.blob.core.windows.net',
        pathname: '/**',
      },
    ],
    // OR if you want to allow multiple domains:
    // domains: ['campomaq.blob.core.windows.net'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp4|webm)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/videos/',
          outputPath: 'static/videos/',
          name: '[name].[hash].[ext]',
        },
      },
    })
    return config
  },
}
 
module.exports = nextConfig