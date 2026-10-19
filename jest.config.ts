import path from 'path'
import type { Config } from 'jest'

const config: Config = {
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        // push-all-in-one 依赖的代理库是 ESM-only，jest 的 CJS 运行时无法加载，测试中以替身替换
        '^(https-proxy-agent|socks-proxy-agent)$': '<rootDir>/jest/mocks/proxy-agents.cjs',
    },
    moduleFileExtensions: [
        'js',
        'json',
        'ts',
    ],
    rootDir: '.',
    testRegex: '.(test|spec).ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    coverageDirectory: path.resolve('./coverage'),
    testEnvironment: 'node',
}

export default config
