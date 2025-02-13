import { Options, defineConfig } from 'tsup'

const option: Options = {
    platform: 'node',
    entry: ['src/index.ts', 'src/vercel.ts'],
    format: ['esm'],
    outExtension({ format }) {
        switch (format) {
            case 'cjs':
                return {
                    js: '.cjs',
                    dts: '.d.ts',
                }
            case 'esm':
                return {
                    js: '.js',
                    dts: '.d.ts',
                }
            case 'iife':
                return {
                    js: '.global.js',
                    dts: '.d.ts',
                }
            default:
                break
        }
        return {
            js: '.js',
            dts: '.d.ts',
        }
    },
    splitting: false, // 代码拆分
    sourcemap: true,
    clean: true,
    dts: false,
    minify: false, // 缩小输出
    // treeshake: true,
    shims: true, // 注入 cjs 和 esm 填充代码，解决 import.meta.url 和 __dirname 的兼容问题
    esbuildOptions(options, context) {
        options.charset = 'utf8'
    },
    // external: [],
    // noExternal: [/(.*)/], // 将依赖打包到一个文件中
    // bundle: true,
    env: {
        NODE_ENV: 'production',
    },
}
export default defineConfig([option])
