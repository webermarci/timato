const production = !process.env.ROLLUP_WATCH;

module.exports = {
    mode: "jit",
    purge: {
        enabled: production,
        content: [
            "./src/**/*.svelte",
        ]
    },
    plugins: []
};