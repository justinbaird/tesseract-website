/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'Content-Security-Policy',
  //           value: [
  //             "default-src 'self'",
  //             "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.supabase.co",
  //             "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  //             "img-src 'self' data: blob: https:",
  //             "font-src 'self' data: https://fonts.gstatic.com",
  //             "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.supabase.co",
  //             "frame-src 'none'",
  //             "object-src 'none'",
  //             "base-uri 'self'",
  //             "worker-src 'self' blob:"
  //           ].join('; ')
  //         }
  //       ]
  //     }
  //   ]
  // }
}

export default nextConfig
