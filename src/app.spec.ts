import app from './app'
import { batchPushAllInOne, runPushAllInOne } from './utils/push'
import { winstonLogger } from './utils/logger'

jest.mock('./utils/push', () => ({
    batchPushAllInOne: jest.fn(async () => [{ status: 'fulfilled', value: { data: 'pushed' } }]),
    runPushAllInOne: jest.fn(async () => ({
        data: 'forwarded',
        status: 200,
        statusText: 'OK',
        headers: { 'x-forward': '1' },
    })),
}))

jest.mock('./utils/logger', () => ({
    __esModule: true,
    default: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
    winstonLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

// 默认不开启鉴权；鉴权用例直接改动该 mock 对象的属性（app.ts 在请求时读取）
jest.mock('./env', () => ({
    __esModule: true,
    AUTH_PUSH_KEY: undefined,
    AUTH_FORWARD_KEY: undefined,
    PORT: 3000,
    TIMEOUT: 20000,
}))

const mockedBatchPush = jest.mocked(batchPushAllInOne)
const mockedForwardPush = jest.mocked(runPushAllInOne)
const mockedWinstonLogger = jest.mocked(winstonLogger)

interface PushResponse {
    message: string
    data: unknown
}

interface ErrorResponse {
    status: number
    statusText: string
    message: string
}

interface OptionResponse {
    message: string
    data: { option: Record<string, unknown> }
}

const jsonRequest = (path: string, body: unknown, headers: Record<string, string> = {}) => app.request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
})

beforeEach(() => {
    mockedBatchPush.mockClear()
    mockedForwardPush.mockClear()
    mockedWinstonLogger.error.mockClear()
})

afterEach(() => {
    delete process.env.PUSH_TEST_SENTINEL
})

describe('GET /option', () => {
    it('应返回全部推送方式的 avue 配置', async () => {
        const response = await app.request('/option')
        const body = await response.json() as OptionResponse

        expect(response.status).toBe(200)
        expect(body.message).toBe('OK')
        expect(Object.keys(body.data.option).length).toBeGreaterThan(0)
    })
})

describe('POST /push', () => {
    it('缺少 title 时应返回 400', async () => {
        const response = await jsonRequest('/push', { desp: '描述' })
        const body = await response.json() as ErrorResponse

        expect(response.status).toBe(400)
        expect(body.status).toBe(400)
        expect(body.message).toContain('title is required')
        expect(mockedBatchPush).not.toHaveBeenCalled()
    })

    it('应把进程环境变量中的字符串配置传给 batchPushAllInOne', async () => {
        process.env.PUSH_TEST_SENTINEL = 'sentinel'

        const response = await jsonRequest('/push', { title: '标题', desp: '描述' })
        const body = await response.json() as PushResponse

        expect(response.status).toBe(200)
        expect(body).toEqual({
            message: 'OK',
            data: [{ status: 'fulfilled', value: { data: 'pushed' } }],
        })

        expect(mockedBatchPush).toHaveBeenCalledTimes(1)
        const [title, desp, env] = mockedBatchPush.mock.calls[0]
        expect(title).toBe('标题')
        expect(desp).toBe('描述')
        // 非字符串环境变量会被过滤
        expect(env?.PUSH_TEST_SENTINEL).toBe('sentinel')
        expect(Object.values(env ?? {}).every((value) => typeof value === 'string')).toBe(true)
    })
})

describe('POST /forward', () => {
    it('缺少 title 时应返回 400', async () => {
        const response = await jsonRequest('/forward', { type: 'ServerChanTurbo', config: {} })
        const body = await response.json() as ErrorResponse

        expect(response.status).toBe(400)
        expect(body.message).toContain('title is required')
        expect(mockedForwardPush).not.toHaveBeenCalled()
    })

    it('应透传 type/config/option 并返回推送结果', async () => {
        const payload = {
            title: '标题',
            desp: '描述',
            type: 'ServerChanTurbo',
            config: { ServerChanTurbo: { SERVER_CHAN_TURBO_SENDKEY: 'sct' } },
            option: { msgtype: 'text' },
        }

        const response = await jsonRequest('/forward', payload)
        const body = await response.json() as PushResponse

        expect(response.status).toBe(200)
        expect(mockedForwardPush).toHaveBeenCalledWith('标题', '描述', {
            type: 'ServerChanTurbo',
            config: { ServerChanTurbo: { SERVER_CHAN_TURBO_SENDKEY: 'sct' } },
            option: { msgtype: 'text' },
        })
        expect(body).toEqual({
            message: 'OK',
            data: {
                data: 'forwarded',
                status: 200,
                statusText: 'OK',
                headers: { 'x-forward': '1' },
            },
        })
    })
})

describe('鉴权', () => {
    // app.ts 在请求时读取鉴权配置，因此直接改动被 mock 的 env 模块即可
    const envMock = jest.requireMock('./env') as { AUTH_PUSH_KEY?: string, AUTH_FORWARD_KEY?: string }

    afterEach(() => {
        envMock.AUTH_PUSH_KEY = undefined
        envMock.AUTH_FORWARD_KEY = undefined
    })

    it('配置 AUTH_PUSH_KEY 后 /push 需要 Bearer token，/forward 不受影响', async () => {
        envMock.AUTH_PUSH_KEY = 'push-secret'

        const unauthorized = await app.request('/push', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: '标题' }),
        })
        expect(unauthorized.status).toBe(401)

        const authorized = await app.request('/push', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer push-secret' },
            body: JSON.stringify({ title: '标题' }),
        })
        expect(authorized.status).toBe(200)

        const forward = await app.request('/forward', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: '标题', type: 'ServerChanTurbo', config: {} }),
        })
        expect(forward.status).toBe(200)
    })

    it('配置 AUTH_FORWARD_KEY 后 /forward 需要 Bearer token', async () => {
        envMock.AUTH_FORWARD_KEY = 'forward-secret'

        const unauthorized = await app.request('/forward', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: '标题', type: 'ServerChanTurbo', config: {} }),
        })
        expect(unauthorized.status).toBe(401)

        const authorized = await app.request('/forward', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer forward-secret' },
            body: JSON.stringify({ title: '标题', type: 'ServerChanTurbo', config: {} }),
        })
        expect(authorized.status).toBe(200)
    })
})
