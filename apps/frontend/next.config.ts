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
      // Nuevos dominios para YouTube y servicios de video
      {
        protocol: 'https',
        hostname: '*.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.youtu.be',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.ytimg.com', // Thumbnails de YouTube
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleapis.com',
        pathname: '/**',
      },
      // URLs locales para desarrollo
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/**',
      },
    ],
    // Configuración adicional para mejor performance
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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