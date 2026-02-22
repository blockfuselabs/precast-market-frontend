/** @type {import('next').NextConfig} */
const nextConfig = {
    optimizeFonts: false,
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
}

export default nextConfig
