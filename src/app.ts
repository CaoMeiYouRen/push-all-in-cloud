import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { timeout } from 'hono/timeout'
import { bearerAuth } from 'hono/bearer-auth'
import { HTTPException } from 'hono/http-exception'
import { StatusCode } from 'hono/utils/http-status'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { env } from 'hono/adapter'
import { MetaPushConfig, PushType } from 'push-all-in-one'
import { batchPushAllInOne, runPushAllInOne } from './utils/push'
import { AUTH_FORWARD_KEY, AUTH_PUSH_KEY, TIMEOUT } from './env'
import { winstonLogger } from './utils/logger'
import { pushAllInOneSchema } from './client'

const app = new Hono()

app.use(logger())
app.use(timeout(TIMEOUT))
app.use(cors())
app.use(secureHeaders({}))

app.onError((error, c) => {
    const message = process.env.NODE_ENV === 'production' ? `${error.name}: ${error.message}` : error.stack
    let status = 500
    let statusText = 'INTERNAL_SERVER_ERROR'
    if (error instanceof HTTPException) {
        const response = error.getResponse()
        status = response.status
        statusText = response.statusText
    }
    c.status(status as StatusCode)
    const requestPath = c.req.path
    winstonLogger.error(`Error in ${requestPath}: \n${message}`)
    return c.json({
        status,
        statusText,
        message,
    })
})

// app.all('/', (c) => c.json({
//     message: 'Hello PushAllInCloud!',
// }))

type PushBody = {
    title: string
    desp?: string
}
app.post('/push', async (c, next) => {
    if (AUTH_PUSH_KEY) {
        return bearerAuth({ token: AUTH_PUSH_KEY })(c, next)
    }
    return next()
}, async (c) => {
    // const { title, desp } = await c.req.json<PushBody>() || {}
    const { title, desp } = (await getBodyByReq(c.req.raw) || {}) as PushBody
    const envValue = env(c) as Record<string, string>
    const data = await batchPushAllInOne(title, desp, envValue)
    return c.json({
        message: 'OK',
        data,
    })
})

type ForwardBody = {
    title: string
    desp?: string
} & MetaPushConfig<PushType>

app.post('/forward', async (c, next) => {
    if (AUTH_FORWARD_KEY) {
        return bearerAuth({ token: AUTH_FORWARD_KEY })(c, next)
    }
    await next()
}, async (c) => {
    const { title, desp, type, config, option } = (await getBodyByReq(c.req.raw) || {}) as ForwardBody
    const { data, status, statusText, headers } = await runPushAllInOne(title, desp, { type, config, option })
    return c.json({
        message: 'OK',
        data: {
            data, headers, status, statusText,
        },
    })
})

app.get('/option', (c) => c.json({
    message: 'OK',
    data: {
        option: pushAllInOneSchema,
    },
}))

/**
 * 从 Request 中获取 body。由于 reader.read() 只能读取一次，第二次读取的时候没有任何响应，所以在第一次读取的时候就直接结束掉。
 * 这个 bug 导致 await c.req.json() 无法获取到数据。
 *
 * @author CaoMeiYouRen
 * @date 2024-11-20
 * @param req
 */
async function getBodyByReq(req: Request) {
    const reader = req.body.getReader()
    let result = ''
    const { value } = await reader.read()// 只能读取一次
    result += new TextDecoder('utf-8').decode(value, { stream: true })
    winstonLogger.info('Raw request body: %s', result)
    return JSON.parse(result)
}

// app.post('/test', async (c) => {
//     try {
//         return c.json({
//             message: 'OK',
//             runtimeKey: getRuntimeKey(),
//             headers: c.req.header(),
//             body: await getBodyByReq(c.req.raw),
//         })
//     } catch (error) {
//         winstonLogger.error('Test error: %O', { error })
//         return c.json({
//             message: 'Error',
//             error: error.message,
//         }, 500)
//     }
// })

export default app
