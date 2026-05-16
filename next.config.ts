import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async rewrites() {
    return [
      {
        source: "/legacy/:path*",
        destination: "/site/:path*",
      },
    ]
  },
}

export default nextConfig
