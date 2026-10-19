const mockDotenvConfig = jest.fn(() => ({ parsed: {} }))

// 隔离本地 .env 文件，保证结果只依赖传入的环境变量
jest.mock('dotenv', () => ({
    __esModule: true,
    default: {
        config: mockDotenvConfig,
    },
}))

const originalEnv = process.env

/** 重置模块并按要求覆盖环境变量后重新加载 env 模块 */
function loadEnv(overrides: Record<string, string | undefined>): typeof import('./env') {
    jest.resetModules()
    process.env = { ...originalEnv }
    Object.entries(overrides).forEach(([key, value]) => {
        if (value === undefined) {
            delete process.env[key]
            return
        }
        process.env[key] = value
    })
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./env') as typeof import('./env')
}

beforeEach(() => {
    mockDotenvConfig.mockClear()
})

afterAll(() => {
    process.env = originalEnv
    jest.resetModules()
})

describe('env 默认值', () => {
    it('未配置时应使用默认值', () => {
        const env = loadEnv({
            NODE_ENV: 'test',
            PORT: undefined,
            TIMEOUT: undefined,
            LOGFILES: undefined,
            AUTH_PUSH_KEY: undefined,
            AUTH_FORWARD_KEY: undefined,
        })

        expect(env.PORT).toBe(3000)
        expect(env.TIMEOUT).toBe(20000)
        expect(env.LOGFILES).toBe(false)
        expect(env.AUTH_PUSH_KEY).toBeUndefined()
        expect(env.AUTH_FORWARD_KEY).toBeUndefined()
        expect(env.__PROD__).toBe(false)
        expect(env.__DEV__).toBe(false)
    })

    it('应依次读取 .env.local 与 .env', () => {
        loadEnv({})

        expect(mockDotenvConfig).toHaveBeenCalledWith({ path: ['.env.local', '.env'] })
    })

    it('PORT 非法时应回退到默认值', () => {
        expect(loadEnv({ PORT: 'abc' }).PORT).toBe(3000)
    })
})

describe('env 显式配置', () => {
    it('应读取字符串与数字配置', () => {
        const env = loadEnv({
            PORT: '8080',
            TIMEOUT: '5000',
            LOGFILES: 'true',
            AUTH_PUSH_KEY: 'push-key',
            AUTH_FORWARD_KEY: 'forward-key',
        })

        expect(env.PORT).toBe(8080)
        expect(env.TIMEOUT).toBe(5000)
        expect(env.LOGFILES).toBe(true)
        expect(env.AUTH_PUSH_KEY).toBe('push-key')
        expect(env.AUTH_FORWARD_KEY).toBe('forward-key')
    })

    it('LOGFILES 仅当值为 true 时开启', () => {
        expect(loadEnv({ LOGFILES: 'false' }).LOGFILES).toBe(false)
        expect(loadEnv({ LOGFILES: '1' }).LOGFILES).toBe(false)
    })

    it('NODE_ENV 决定 __PROD__ 与 __DEV__', () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(jest.fn())
        try {
            expect(loadEnv({ NODE_ENV: 'production' }).__PROD__).toBe(true)
            expect(loadEnv({ NODE_ENV: 'production' }).__DEV__).toBe(false)
            // development 下会打印 envObj
            expect(loadEnv({ NODE_ENV: 'development' }).__DEV__).toBe(true)
            expect(loadEnv({ NODE_ENV: 'development' }).__PROD__).toBe(false)
            expect(logSpy).toHaveBeenCalledWith('envObj', {})
        } finally {
            logSpy.mockRestore()
        }
    })
})
