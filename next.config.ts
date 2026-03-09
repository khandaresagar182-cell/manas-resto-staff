import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "raw.githubusercontent.com",
            },
        ],
    },
    async headers() {
        return [
            {
                // Service worker must NEVER be cached by the browser itself
                // so it always picks up a new version on next visit
                source: "/sw.js",
                headers: [
                    { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
                    { key: "Service-Worker-Allowed", value: "/" },
                ],
            },
            {
                // Next.js content-hashed bundles — safe to cache forever in browser
                source: "/_next/static/:path*",
                headers: [
                    { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
                ],
            },
        ];
    },
};

export default nextConfig;

