import path from 'path'
import type { Config } from 'jest'

const config: Config = {
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
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
