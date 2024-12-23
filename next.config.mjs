/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img-chaosatleast.vercel.app",
                pathname: "/api/image/*", // Correct pattern to match the image URL path
            },
        ],
    },
};

export default nextConfig;
