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

// 是否禁用写入日志到文件
export const NO_LOGFILES = process.env.NO_LOGFILES === 'true'

export const TIMEOUT = parseInt(process.env.TIMEOUT) || 20000
