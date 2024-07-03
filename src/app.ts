import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { batchPushAllInOne, PushAllInOneConfig, PushType, runPushAllInOne } from './utils/push'

const app = new Hono()

app.use(logger())

app.all('/', (c) => c.json({
    message: 'Hello PushAllInCloud!',
}))

type PushBody = {
    title: string
    desp?: string
}

app.post('/push', async (c) => {
    const { title, desp } = await c.req.json<PushBody>()
    const data = await batchPushAllInOne(title, desp)
    return c.json({
        message: 'OK',
        data,
    })
})

type ForwardBody = {
    title: string
    desp?: string
    pushConfig: PushAllInOneConfig<PushType>
}

app.post('/forward', async (c) => {
    const { title, desp, pushConfig } = await c.req.json<ForwardBody>()
    const { data, headers, status, statusText } = await runPushAllInOne(title, desp, pushConfig)
    return c.json({
        message: 'OK',
        data: {
            data, headers, status, statusText,
        },
    })
})

export default app
