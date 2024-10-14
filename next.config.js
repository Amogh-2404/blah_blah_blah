// next.config.js
module.exports = {
    // Your Next.js configuration
    reactStrictMode: true,
    // ...other configurations
    env: {
        NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
    },
};
