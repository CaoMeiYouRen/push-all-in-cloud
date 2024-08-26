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

export const PORT = parseInt(process.env.PORT) || 3000

// 是否写入日志到文件
export const LOGFILES = process.env.LOGFILES === 'true'

export const TIMEOUT = parseInt(process.env.TIMEOUT) || 20000

export const AUTH_PUSH_KEY = process.env.AUTH_PUSH_KEY

export const AUTH_FORWARD_KEY = process.env.AUTH_FORWARD_KEY
