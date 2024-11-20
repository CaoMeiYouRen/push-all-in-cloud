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
    const { title, desp } = await c.req.json<PushBody>() || {}
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
    const { title, desp, type, config, option } = await c.req.json<ForwardBody>() || {}
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

export default app
