/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    reactStrictMode: true,
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
                    { key: "Referrer-Policy", value: "same-origin" },
                    { key: "X-Frame-Options", value: "deny" },
                    { key: "Strict-Transport-Security", value: "max-age=31536000;includeSubDomains" },
                    { key: "X-Content-Type-Options", value: "nosniff" },
                ]
            }
        ]
    }
}

module.exports = nextConfig
