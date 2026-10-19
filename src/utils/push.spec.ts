import * as pushAllInOne from 'push-all-in-one'
import { batchPushAllInOne, runPushAllInOne } from './push'
import logger from './logger'

interface PushRecord {
    name: string
    config: Record<string, unknown>
    args: unknown[][]
}

/**
 * 以替身替换 push-all-in-one，避免单元测试发起真实网络请求。
 * 替身会记录每次实例化时的 config 与 send 调用参数，供断言使用。
 */
jest.mock('push-all-in-one', () => {
    const records: PushRecord[] = []
    const createPush = (name: string) => class MockPush {
        public readonly record: PushRecord

        public constructor(config: Record<string, unknown>) {
            this.record = { name, config, args: [] }
            records.push(this.record)
        }

        public send(...args: unknown[]): Promise<unknown> {
            this.record.args.push(args)
            if (args[0] === '推送失败') {
                return Promise.reject(new Error(`${name} 推送失败`))
            }
            return Promise.resolve({
                data: `${name}-ok`,
                status: 200,
                statusText: 'OK',
                headers: { 'x-push': name },
            })
        }
    }
    const mockRunPushAllInOne = jest.fn(async (title: string, desp: string, meta: unknown) => ({
        data: { title, desp, meta },
        status: 200,
        statusText: 'OK',
        headers: {},
    }))
    return {
        ServerChanTurbo: createPush('ServerChanTurbo'),
        ServerChanV3: createPush('ServerChanV3'),
        CustomEmail: createPush('CustomEmail'),
        Dingtalk: createPush('Dingtalk'),
        WechatRobot: createPush('WechatRobot'),
        WechatApp: createPush('WechatApp'),
        Feishu: createPush('Feishu'),
        PushPlus: createPush('PushPlus'),
        IGot: createPush('IGot'),
        Qmsg: createPush('Qmsg'),
        XiZhi: createPush('XiZhi'),
        PushDeer: createPush('PushDeer'),
        Discord: createPush('Discord'),
        Telegram: createPush('Telegram'),
        OneBot: createPush('OneBot'),
        Ntfy: createPush('Ntfy'),
        WxPusher: createPush('WxPusher'),
        runPushAllInOne: mockRunPushAllInOne,
        __records: records,
        __runPushAllInOne: mockRunPushAllInOne,
    }
})

jest.mock('./logger', () => ({
    __esModule: true,
    default: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    },
}))

const mockedPushAllInOne = pushAllInOne as unknown as {
    __records: PushRecord[]
    __runPushAllInOne: jest.Mock
}
const records = mockedPushAllInOne.__records
const mockedLogger = jest.mocked(logger)

const title = '标题'
const desp = '描述'

beforeEach(() => {
    records.length = 0
    mockedPushAllInOne.__runPushAllInOne.mockClear()
    mockedLogger.info.mockClear()
    mockedLogger.warn.mockClear()
})

describe('batchPushAllInOne', () => {
    it('未配置任何推送时应返回空数组并告警', async () => {
        const results = await batchPushAllInOne(title, desp, {})

        expect(results).toEqual([])
        expect(records).toHaveLength(0)
        expect(mockedLogger.warn).toHaveBeenCalledWith('未配置任何推送，请检查推送配置的环境变量！')
    })

    const cases: {
        name: string
        env: NodeJS.ProcessEnv
        config: Record<string, unknown>
        args: unknown[]
    }[] = [
        {
            name: 'ServerChanTurbo',
            env: { SERVER_CHAN_TURBO_SENDKEY: 'sct' },
            config: { SERVER_CHAN_TURBO_SENDKEY: 'sct' },
            args: [title, desp, {}],
        },
        {
            name: 'ServerChanV3',
            env: { SERVER_CHAN_V3_SENDKEY: 'v3' },
            config: { SERVER_CHAN_V3_SENDKEY: 'v3' },
            args: [title, desp, {}],
        },
        {
            name: 'CustomEmail',
            env: {
                EMAIL_AUTH_USER: 'user@example.com',
                EMAIL_AUTH_PASS: 'pass',
                EMAIL_HOST: 'smtp.example.com',
                EMAIL_PORT: '465',
                EMAIL_TO_ADDRESS: 'to@example.com',
                EMAIL_TYPE: 'html',
            },
            config: {
                EMAIL_TYPE: 'html',
                EMAIL_TO_ADDRESS: 'to@example.com',
                EMAIL_AUTH_USER: 'user@example.com',
                EMAIL_AUTH_PASS: 'pass',
                EMAIL_HOST: 'smtp.example.com',
                EMAIL_PORT: 465,
            },
            args: [title, desp],
        },
        {
            name: 'Dingtalk',
            env: { DINGTALK_ACCESS_TOKEN: 'token' },
            config: { DINGTALK_ACCESS_TOKEN: 'token' },
            // 未配置 DINGTALK_MSG_TYPE 时默认 text
            args: [title, desp, { msgtype: 'text' }],
        },
        {
            name: 'Dingtalk',
            env: { DINGTALK_ACCESS_TOKEN: 'token', DINGTALK_SECRET: 'secret', DINGTALK_MSG_TYPE: 'markdown' },
            config: { DINGTALK_ACCESS_TOKEN: 'token', DINGTALK_SECRET: 'secret' },
            args: [title, desp, { msgtype: 'markdown' }],
        },
        {
            name: 'WechatRobot',
            env: { WECHAT_ROBOT_KEY: 'key' },
            config: { WECHAT_ROBOT_KEY: 'key' },
            args: [title, desp, { msgtype: 'text' }],
        },
        {
            name: 'WechatApp',
            env: { WECHAT_APP_CORPID: 'corp', WECHAT_APP_AGENTID: '1001', WECHAT_APP_SECRET: 'secret' },
            config: { WECHAT_APP_CORPID: 'corp', WECHAT_APP_AGENTID: 1001, WECHAT_APP_SECRET: 'secret' },
            // 未配置 WECHAT_APP_USERID 时默认 @all
            args: [title, desp, { msgtype: 'text', touser: '@all' }],
        },
        {
            name: 'WechatApp',
            env: {
                WECHAT_APP_CORPID: 'corp',
                WECHAT_APP_AGENTID: '1001',
                WECHAT_APP_SECRET: 'secret',
                WECHAT_APP_MSG_TYPE: 'markdown',
                WECHAT_APP_USERID: 'user1',
            },
            config: { WECHAT_APP_CORPID: 'corp', WECHAT_APP_AGENTID: 1001, WECHAT_APP_SECRET: 'secret' },
            args: [title, desp, { msgtype: 'markdown', touser: 'user1' }],
        },
        {
            name: 'Feishu',
            env: { FEISHU_APP_ID: 'id', FEISHU_APP_SECRET: 'secret', FEISHU_RECEIVE_ID: 'receive' },
            config: { FEISHU_APP_ID: 'id', FEISHU_APP_SECRET: 'secret' },
            args: [title, desp, { receive_id_type: 'open_id', receive_id: 'receive', msg_type: 'text' }],
        },
        {
            name: 'PushPlus',
            env: { PUSH_PLUS_TOKEN: 'token' },
            config: { PUSH_PLUS_TOKEN: 'token' },
            args: [title, desp, { template: 'html', channel: 'wechat' }],
        },
        {
            name: 'IGot',
            env: { I_GOT_KEY: 'key' },
            config: { I_GOT_KEY: 'key' },
            args: [title, desp, {}],
        },
        {
            name: 'Qmsg',
            env: { QMSG_KEY: 'key', QMSG_QQ: '10001' },
            config: { QMSG_KEY: 'key' },
            args: [title, desp, { type: 'send', qq: '10001' }],
        },
        {
            name: 'XiZhi',
            env: { XI_ZHI_KEY: 'key' },
            config: { XI_ZHI_KEY: 'key' },
            args: [title, desp],
        },
        {
            name: 'PushDeer',
            env: { PUSH_DEER_PUSH_KEY: 'key', PUSH_DEER_ENDPOINT: 'https://api2.pushdeer.com' },
            config: { PUSH_DEER_PUSH_KEY: 'key', PUSH_DEER_ENDPOINT: 'https://api2.pushdeer.com' },
            args: [title, desp, { type: 'markdown' }],
        },
        {
            name: 'Discord',
            env: { DISCORD_WEBHOOK: 'https://discord.com/api/webhooks/1/2', DISCORD_USERNAME: 'bot' },
            config: { DISCORD_WEBHOOK: 'https://discord.com/api/webhooks/1/2' },
            args: [title, desp, { username: 'bot' }],
        },
        {
            name: 'Telegram',
            env: { TELEGRAM_BOT_TOKEN: 'token', TELEGRAM_CHAT_ID: '12345' },
            config: { TELEGRAM_BOT_TOKEN: 'token', TELEGRAM_CHAT_ID: 12345 },
            args: [title, desp, { disable_notification: false }],
        },
        {
            name: 'OneBot',
            env: { ONE_BOT_BASE_URL: 'http://127.0.0.1:3000', ONE_BOT_ACCESS_TOKEN: 'token', ONE_BOT_RECIEVER_ID: '10001' },
            config: { ONE_BOT_BASE_URL: 'http://127.0.0.1:3000', ONE_BOT_ACCESS_TOKEN: 'token' },
            // 未配置 ONE_BOT_MSG_TYPE 时默认私聊
            args: [title, desp, { message_type: 'private', user_id: 10001 }],
        },
        {
            name: 'OneBot',
            env: {
                ONE_BOT_BASE_URL: 'http://127.0.0.1:3000',
                ONE_BOT_ACCESS_TOKEN: 'token',
                ONE_BOT_RECIEVER_ID: '20002',
                ONE_BOT_MSG_TYPE: 'group',
            },
            config: { ONE_BOT_BASE_URL: 'http://127.0.0.1:3000', ONE_BOT_ACCESS_TOKEN: 'token' },
            args: [title, desp, { message_type: 'group', group_id: 20002 }],
        },
        {
            name: 'Ntfy',
            env: { NTFY_TOPIC: 'topic' },
            // 未配置 NTFY_URL 时默认 https://ntfy.sh
            config: { NTFY_URL: 'https://ntfy.sh', NTFY_TOPIC: 'topic' },
            args: [title, desp, { priority: 1, markdown: false, cache: false, firebase: false, unifiedPush: false }],
        },
        {
            name: 'Ntfy',
            env: {
                NTFY_TOPIC: 'topic',
                NTFY_URL: 'http://127.0.0.1:8080',
                NTFY_PRIORITY: '5',
                NTFY_MARKDOWN: 'true',
                NTFY_CACHE: 'true',
                NTFY_FIREBASE: 'true',
                NTFY_UNIFIED_PUSH: 'true',
                NTFY_TAGS: 'tag1,tag2',
            },
            config: { NTFY_URL: 'http://127.0.0.1:8080', NTFY_TOPIC: 'topic' },
            args: [title, desp, {
                priority: 5,
                markdown: true,
                cache: true,
                firebase: true,
                unifiedPush: true,
                tags: 'tag1,tag2',
            }],
        },
        {
            name: 'WxPusher',
            env: { WX_PUSHER_APP_TOKEN: 'token', WX_PUSHER_UID: 'uid' },
            config: { WX_PUSHER_APP_TOKEN: 'token', WX_PUSHER_UID: 'uid' },
            // 固定使用 markdown 格式
            args: [title, desp, { contentType: 3 }],
        },
    ]

    cases.forEach(({ name, env, config, args }) => {
        it(`配置 ${Object.keys(env).join(' + ')} 时应以 ${name} 推送`, async () => {
            const results = await batchPushAllInOne(title, desp, env)

            expect(records).toHaveLength(1)
            expect(records[0].name).toBe(name)
            expect(records[0].config).toEqual(config)
            expect(records[0].args[0]).toEqual(args)

            // 结果只保留 data/status/statusText/headers
            expect(results).toEqual([{
                status: 'fulfilled',
                value: {
                    data: `${name}-ok`,
                    status: 200,
                    statusText: 'OK',
                    headers: { 'x-push': name },
                },
            }])
        })
    })

    it('缺少必填配置时对应推送应被跳过', async () => {
        // 企业微信应用缺少 WECHAT_APP_SECRET，不应加入推送队列
        const results = await batchPushAllInOne(title, desp, {
            WECHAT_APP_CORPID: 'corp',
            WECHAT_APP_AGENTID: '1001',
        })

        expect(results).toEqual([])
        expect(records).toHaveLength(0)
    })

    it('desp 为空时 Qmsg 应发送空字符串', async () => {
        await batchPushAllInOne(title, undefined, { QMSG_KEY: 'key' })

        expect(records[0].args[0]).toEqual([title, '', { type: 'send', qq: '' }])
    })

    it('配置多个推送时应全部发送并统计成功失败数量', async () => {
        const env = { SERVER_CHAN_TURBO_SENDKEY: 'sct', I_GOT_KEY: 'key' }

        const success = await batchPushAllInOne(title, desp, env)
        expect(records).toHaveLength(2)
        expect(success.map((item) => item.status)).toEqual(['fulfilled', 'fulfilled'])
        expect(mockedLogger.info).toHaveBeenCalledWith('本次共推送 2 个，成功 2 个，失败 0 个')

        records.length = 0
        const failure = await batchPushAllInOne('推送失败', desp, env)
        expect(records).toHaveLength(2)
        expect(failure.map((item) => item.status)).toEqual(['rejected', 'rejected'])
        expect(mockedLogger.info).toHaveBeenCalledWith('本次共推送 2 个，成功 0 个，失败 2 个')
    })
})

describe('runPushAllInOne', () => {
    it('应从 push 模块重新导出', () => {
        expect(runPushAllInOne).toBe(mockedPushAllInOne.__runPushAllInOne)
    })
})
