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
    				destination: `${process.env.NEXT_PUBLIC_C15T_URL}/:path*`,
    			},
    		];
    	}
}

export default nextConfig;
