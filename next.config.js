module.exports = {
    // basePath: '/magazine',
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: false,
    },
    typescript: {
        ignoreBuildErrors: false
    },
    experimental: {
        serverActions: true
    }
}