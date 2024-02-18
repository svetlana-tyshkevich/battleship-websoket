const path = require('path');

module.exports = {
    target: 'es2022',
    entry: './index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: ['/node_modules/', '/build/', '/dist/'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    experiments: {
        outputModule: true,
    },
    externals: {
        'node:http': 'commonjs2 node:http',
    },
};