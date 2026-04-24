/**
 * @type {import('next').NextConfig}
 */
const nextConfig: import('next').NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  trailingSlash: true,
  experimental: {
    staleTimes: {
      dynamic: 0,   // don't cache RSC payloads for dynamic routes
      static: 300,  // 5 min for static routes
    },
  },
  images: {
    remotePatterns: [
      // Tu configuración existente
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
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 3600,
    deviceSizes: [640, 828, 1080, 1920],
    imageSizes: [48, 96, 256],
  },
  webpack(config) {
    // Tu configuración existente de webpack para videos
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
    });
    
    // Opcional: Configuración adicional para manejar más tipos de archivo de video
    config.module.rules.push({
      test: /\.(mov|avi|mkv|m4v|ogg)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/videos/',
          outputPath: 'static/videos/',
          name: '[name].[hash].[ext]',
        },
      },
    });
    
    return config;
  },
};

module.exports = nextConfig;