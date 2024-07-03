import { handle } from 'hono/vercel'
import app from '../src/app'
import logger from '../src/utils/logger'

export const config = {
    runtime: 'edge',
}

logger.info('push-all-in-cloud 云函数启动成功')

export default handle(app)
