module.exports = {
    // basePath: '/magazine',
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true
    },
    experimental: {
        serverActions: true
    }
}