import { serve } from '@hono/node-server'
import { PORT } from './env'
import app from './app'
import logger from './utils/logger'

serve({
    fetch: app.fetch,
    port: PORT,
})

logger.info(`push-all-in-cloud 启动成功，访问地址：http://localhost:${PORT}`)
