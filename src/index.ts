import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { PORT } from './env'
import app from './app'
import logger from './utils/logger'
// nodejs 运行时添加 静态文件服务。vercel 会自动挂载 public 文件夹为静态文件目录，所以无需添加
app.get('/*', serveStatic({ root: './public' }))

serve({
    fetch: app.fetch,
    port: PORT,
})

logger.info(`push-all-in-cloud 启动成功，访问地址：http://localhost:${PORT}`)
