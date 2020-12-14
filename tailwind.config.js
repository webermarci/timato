const production = !process.env.ROLLUP_WATCH;

module.exports = {
    future: {
        purgeLayersByDefault: true,
        removeDeprecatedGapUtilities: true,
    },
    purge: {
        enabled: production,
        content: [
            "./src/**/*.svelte",
            "./public/**/*.html"
        ]
    },
    plugins: []
};