import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // ✅ Если всё же используете Server Actions
    },
},
    async rewrites() {
    		return [
    			{
    				source: '/api/c15t/:path*',
    				destination: `https://clipreel-europe-onboarding.c15t.dev/:path*`,
    			},
    		];
    	}
}

export default nextConfig;
