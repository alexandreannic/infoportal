"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("vite");
var plugin_react_1 = require("@vitejs/plugin-react");
var vite_plugin_dts_1 = require("vite-plugin-dts"); // generates .d.ts files
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)(), (0, vite_plugin_dts_1.default)()],
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'MyLib',
            formats: ['es', 'umd'],
            fileName: function (format) { return "index.".concat(format, ".js"); },
        },
        rollupOptions: {
            external: ['react', 'react-dom'], // don't bundle peer deps
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
});
