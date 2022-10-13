const { build } = require('esbuild');
const fs = require('fs');

const mode = process.env.NODE_ENV || 'production';

build({
    bundle: true,
    minify: mode === 'production',
    sourcemap: mode === 'development',
    watch: mode === 'development' && {
        onRebuild: (_error, _result) => {
            console.log('----------------------');
        },
    },
    entryPoints: ['src/index.tsx'],
    outdir: 'dist',
});

fs.cpSync('data', 'dist/data', { recursive: true });
