import type { NextConfig } from "next"

const nextConfig: NextConfig = {
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
