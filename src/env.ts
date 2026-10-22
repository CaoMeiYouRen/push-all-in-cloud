import dotenv from 'dotenv'
const modes = [
    '.env.local',
    '.env',
]
const result = dotenv.config({
    path: modes,
})
const envObj = result.parsed

if (process.env.NODE_ENV === 'development') {
    console.log('envObj', envObj)
}

export const __PROD__ = process.env.NODE_ENV === 'production'

export const __DEV__ = process.env.NODE_ENV === 'development'

export const PORT = Number.parseInt(process.env.PORT ?? '', 10) || 3000

// 是否写入日志到文件
export const LOGFILES = process.env.LOGFILES === 'true'

export const TIMEOUT = Number.parseInt(process.env.TIMEOUT ?? '', 10) || 20000

export const AUTH_PUSH_KEY = process.env.AUTH_PUSH_KEY

export const AUTH_FORWARD_KEY = process.env.AUTH_FORWARD_KEY

// 兼容匿名 /forward。生产环境未设置 AUTH_FORWARD_KEY 时，默认拒绝匿名请求；设为 true 才放行。
export const ALLOW_PUBLIC_FORWARD = process.env.ALLOW_PUBLIC_FORWARD === 'true'
