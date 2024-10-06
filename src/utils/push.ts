import { AxiosResponse } from 'axios'
import { ServerChanTurbo, ServerChanV3, CustomEmail, Dingtalk, WechatRobot, WechatApp, PushPlus, IGot, Qmsg, XiZhi, PushDeer, Discord, OneBot, Telegram, MsgType, TemplateType, CustomEmailType, OneBotMsgType, ChannelType, PushDeerPushType, QmsgPushType } from 'push-all-in-one'
import logger from './logger'

const warn = (text: string) => logger.warn(text)
const info = (text: string) => logger.info(text)

/**
 *
 * 从环境变量读取配置并批量推送
 * @author CaoMeiYouRen
 * @date 2023-10-25
 * @export
 * @param title
 * @param [desp]
 */
export async function batchPushAllInOne(title: string, desp?: string, env: Record<string, string> = process.env): Promise<PromiseSettledResult<Pick<AxiosResponse<any>, 'data' | 'headers' | 'status' | 'statusText'>>[]> {
    const pushs: Promise<AxiosResponse<any>>[] = []
    if (env.SCTKEY) {
        // Server酱。官方文档：https://sct.ftqq.com/
        const serverChanTurbo = new ServerChanTurbo(env.SCTKEY)
        pushs.push(serverChanTurbo.send(title, desp))
        info('Server酱·Turbo 已加入推送队列')
    } else {
        info('未配置 Server酱·Turbo，已跳过')
    }

    if (env.SERVER_CHAN_V3_KEY) {
        // Server酱³。官方文档：https://sc3.ft07.com/doc
        const serverChanV3 = new ServerChanV3(env.SERVER_CHAN_V3_KEY)
        pushs.push(serverChanV3.send(title, desp))
        info('Server酱³ 已加入推送队列')
    } else {
        info('未配置 Server酱³，已跳过')
    }

    if (env.EMAIL_AUTH_USER && env.EMAIL_AUTH_PASS && env.EMAIL_HOST && env.EMAIL_PORT && env.EMAIL_TO_ADDRESS) {
        // 自定义邮件，基于 nodemailer 实现，官方文档: https://github.com/nodemailer/nodemailer
        const customEmail = new CustomEmail({
            EMAIL_TYPE: env.EMAIL_TYPE as CustomEmailType,
            EMAIL_TO_ADDRESS: env.EMAIL_TO_ADDRESS,
            EMAIL_AUTH_USER: env.EMAIL_AUTH_USER,
            EMAIL_AUTH_PASS: env.EMAIL_AUTH_PASS,
            EMAIL_HOST: env.EMAIL_HOST,
            EMAIL_PORT: Number(env.EMAIL_PORT),
        })
        pushs.push(customEmail.send(title, desp).then((result) => ({ data: result.response, status: 200, statusText: 'OK', headers: {} as any, config: {} as any })))
        info('自定义邮件 已加入推送队列')
    } else {
        info('未配置 自定义邮件，已跳过')
    }

    if (env.DINGTALK_ACCESS_TOKEN) {
        // 钉钉机器人。官方文档：https://developers.dingtalk.com/document/app/custom-robot-access
        const dingtalk = new Dingtalk(env.DINGTALK_ACCESS_TOKEN, env.DINGTALK_SECRET)
        pushs.push(dingtalk.send(title, desp))
        info('钉钉机器人 已加入推送队列')
    } else {
        info('未配置 钉钉机器人，已跳过')
    }

    if (env.WX_ROBOT_KEY) {
        // 企业微信群机器人。官方文档：https://work.weixin.qq.com/help?person_id=1&doc_id=13376
        // 企业微信群机器人的使用需要两人以上加入企业，如果个人使用微信推送建议使用 企业微信应用+微信插件 推送
        const wechatRobot = new WechatRobot(env.WX_ROBOT_KEY)
        pushs.push(wechatRobot.send(`${title}\n${desp}`, env.WX_ROBOT_MSG_TYPE as MsgType))
        info('企业微信群机器人 已加入推送队列')
    } else {
        info('未配置 企业微信群机器人，已跳过')
    }

    if (env.WX_APP_CORPID && env.WX_APP_AGENTID && env.WX_APP_SECRET) {
        // 企业微信应用推送，官方文档：https://work.weixin.qq.com/api/doc/90000/90135/90664
        const wechatApp = new WechatApp({
            WX_APP_CORPID: env.WX_APP_CORPID,
            WX_APP_AGENTID: Number(env.WX_APP_AGENTID),
            WX_APP_SECRET: env.WX_APP_SECRET,
            WX_APP_USERID: env.WX_APP_USERID,
        })
        pushs.push(wechatApp.send(`${title}\n${desp}`))
        info('企业微信应用推送 已加入推送队列')
    } else {
        info('未配置 企业微信应用推送，已跳过')
    }

    if (env.PUSH_PLUS_TOKEN) {
        // pushplus 推送，官方文档：http://pushplus.hxtrip.com/doc/
        const pushplus = new PushPlus(env.PUSH_PLUS_TOKEN)
        pushs.push(pushplus.send(title, desp, env.PUSH_PLUS_TEMPLATE_TYPE as TemplateType))
        info('pushplus 推送 已加入推送队列')
    } else {
        info('未配置 pushplus 推送，已跳过')
    }

    if (env.I_GOT_KEY) {
        // iGot 推送，官方文档：https://wahao.github.io/Bark-MP-helper
        const iGot = new IGot(env.I_GOT_KEY)
        pushs.push(iGot.send(title, desp))
        info('iGot 推送 已加入推送队列')
    } else {
        info('未配置 iGot 推送，已跳过')
    }

    if (env.QMSG_KEY) {
        // Qmsg 酱 推送，官方文档：https://qmsg.zendee.cn
        const qmsg = new Qmsg(env.QMSG_KEY)
        pushs.push(qmsg.send(title, desp))
        info('Qmsg 推送 已加入推送队列')
    } else {
        info('未配置 Qmsg 推送，已跳过')
    }

    if (env.XI_ZHI_KEY) {
        // 息知 推送，官方文档：https://xz.qqoq.net/#/index
        const xiZhi = new XiZhi(env.XI_ZHI_KEY)
        pushs.push(xiZhi.send(title, desp))
        info('XiZhi 推送 已加入推送队列')
    } else {
        info('未配置 XiZhi 推送，已跳过')
    }

    if (env.PUSH_DEER_PUSH_KEY) {
        // 【推荐】PushDeer 推送，官方文档：https://github.com/easychen/pushdeer
        const pushDeer = new PushDeer(env.PUSH_DEER_PUSH_KEY)
        pushs.push(pushDeer.send(title, desp))
        info('PushDeer 推送 已加入推送队列')
    } else {
        info('未配置 PushDeer 推送，已跳过')
    }

    if (env.DISCORD_WEBHOOK) {
        // 【推荐】Discord Webhook 推送，官方文档：https://support.discord.com/hc/zh-tw/articles/228383668-%E4%BD%BF%E7%94%A8%E7%B6%B2%E7%B5%A1%E9%89%A4%E6%89%8B-Webhooks-
        const discord = new Discord(env.DISCORD_WEBHOOK, env.DISCORD_USERNAME)
        pushs.push(discord.send(`${title}\n${desp}`))
        info('Discord 推送 已加入推送队列')
    } else {
        info('未配置 Discord 推送，已跳过')
    }

    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
        // 【推荐】Telegram Bot 推送。官方文档：https://core.telegram.org/bots/api#making-requests
        const telegram = new Telegram({
            TELEGRAM_BOT_TOKEN: env.TELEGRAM_BOT_TOKEN,
            TELEGRAM_CHAT_ID: Number(env.TELEGRAM_CHAT_ID),
        })
        pushs.push(telegram.send(`${title}\n${desp}`))
        info('Telegram 推送 已加入推送队列')
    } else {
        info('未配置 Telegram 推送，已跳过')
    }

    if (env.ONE_BOT_BASE_URL && env.ONE_BOT_ACCESS_TOKEN) {
        // OneBot 推送。官方文档：https://github.com/botuniverse/onebot-11
        // 本项目实现的版本为 OneBot 11
        // 在 mirai 环境下实现的插件版本可参考：https://github.com/yyuueexxiinngg/onebot-kotlin
        const oneBot = new OneBot(env.ONE_BOT_BASE_URL, env.ONE_BOT_ACCESS_TOKEN)
        pushs.push(oneBot.send(`${title}\n${desp}`, env.ONE_BOT_MSG_TYPE as OneBotMsgType, Number(env.ONE_BOT_RECIEVER_ID)))
        info('Discord 推送 已加入推送队列')
    } else {
        info('未配置 Discord 推送，已跳过')
    }

    if (pushs.length === 0) {
        warn('未配置任何推送，请检查推送配置的环境变量！')
        return []
    }

    const results = await Promise.allSettled(pushs.map((push) => push.then((e) => {
        const { data, headers, status, statusText } = e
        return {
            data, headers, status, statusText,
        }
    })))
    const success = results.filter((e) => e.status === 'fulfilled')
    const fail = results.filter((e) => e.status === 'rejected')

    info(`本次共推送 ${results.length} 个，成功 ${success.length} 个，失败 ${fail.length} 个`)

    return results
}

export type PushConfig = Required<{
    ServerChanTurbo?: {
        SCTKEY: string
    }
    ServerChanV3?: {
        SERVER_CHAN_V3_KEY: string
    }
    Dingtalk?: {
        DINGTALK_ACCESS_TOKEN: string
        DINGTALK_SECRET?: string
    }
    CustomEmail?: {
        EMAIL_TYPE: CustomEmailType // 邮件类型
        EMAIL_TO_ADDRESS: string // 收件人
        EMAIL_AUTH_USER: string // 发件邮箱
        EMAIL_AUTH_PASS: string // 密码/授权码
        EMAIL_HOST: string // 发件域名
        EMAIL_PORT: number // 发件端口
    }
    WechatRobot?: {
        WX_ROBOT_KEY: string
        WX_ROBOT_MSG_TYPE: MsgType
    }
    WechatApp?: {
        WX_APP_CORPID: string
        WX_APP_AGENTID: number
        WX_APP_SECRET: string
        WX_APP_USERID: string
    }
    PushPlus?: {
        PUSH_PLUS_TOKEN: string
        PUSH_PLUS_TEMPLATE_TYPE?: TemplateType
        PUSH_PLUS_CHANNEL_TYPE?: ChannelType
    }
    IGot?: {
        I_GOT_KEY: string
    }
    Qmsg?: {
        QMSG_KEY: string
        QMSG_QQ: string
        QMSG_PUSH_TYPE: QmsgPushType
    }
    XiZhi?: {
        XI_ZHI_KEY: string
    }
    PushDeer?: {
        PUSH_DEER_PUSH_KEY: string
        PUSH_DEER_ENDPOINT?: string
        PUSH_DEER_PUSH_TYPE?: PushDeerPushType
    }
    Discord?: {
        DISCORD_WEBHOOK: string
        DISCORD_USERNAME: string
    }
    Telegram?: {
        TELEGRAM_BOT_TOKEN: string
        TELEGRAM_CHAT_ID: number
        TELEGRAM_SEND_SILENTLY?: boolean
        TELEGRAM_PROTECT_CONTENT?: boolean
        TELEGRAM_MESSAGE_THREAD_ID?: string
    }
    OneBot?: {
        ONE_BOT_BASE_URL: string
        ONE_BOT_ACCESS_TOKEN?: string
        ONE_BOT_MSG_TYPE: OneBotMsgType
        ONE_BOT_RECIEVER_ID: number
    }
}>

export type PushType = keyof PushConfig

export type MetaPushConfig<T extends PushType> = {
    type: T
    config: PushConfig[T]
}

export declare type PushAllInOneConfig<T extends PushType = PushType> = T extends any ? MetaPushConfig<T> : never

/**
 * 从传入变量中读取配置，并选择一个渠道推送
 *
 * @author CaoMeiYouRen
 * @date 2023-10-25
 * @export
 * @param title
 * @param desp
 * @param pushConfig
 */
export async function runPushAllInOne(title: string, desp: string, pushConfig: PushAllInOneConfig<PushType>): Promise<AxiosResponse<any, any>> {
    switch (pushConfig.type) {
        case 'ServerChanTurbo': {
            const { SCTKEY } = pushConfig.config
            const serverChanTurbo = new ServerChanTurbo(SCTKEY)
            return serverChanTurbo.send(title, desp)
        }
        case 'ServerChanV3': {
            const { SERVER_CHAN_V3_KEY } = pushConfig.config
            const serverChanV3 = new ServerChanV3(SERVER_CHAN_V3_KEY)
            return serverChanV3.send(title, desp)
        }
        case 'CustomEmail': {
            const customEmail = new CustomEmail(pushConfig.config)
            const result = await customEmail.send(title, desp)
            const response = { data: result.response, status: 200, statusText: 'OK', headers: {} as any, config: {} as any }
            return response
        }
        case 'Dingtalk': {
            const { DINGTALK_ACCESS_TOKEN, DINGTALK_SECRET } = pushConfig.config
            const dingtalk = new Dingtalk(DINGTALK_ACCESS_TOKEN, DINGTALK_SECRET)
            const response = await dingtalk.send(title, desp)
            return response
        }
        case 'WechatRobot': {
            const { WX_ROBOT_KEY, WX_ROBOT_MSG_TYPE } = pushConfig.config
            const wechatRobot = new WechatRobot(WX_ROBOT_KEY)
            const response = await wechatRobot.send(`${title}\n${desp}`, WX_ROBOT_MSG_TYPE)
            return response
        }
        case 'WechatApp': {
            const { WX_APP_CORPID, WX_APP_AGENTID, WX_APP_SECRET, WX_APP_USERID } = pushConfig.config
            const wechatApp = new WechatApp({
                WX_APP_CORPID,
                WX_APP_AGENTID,
                WX_APP_SECRET,
                WX_APP_USERID,
            })
            const response = await wechatApp.send(`${title}\n${desp}`)
            return response
        }
        case 'PushPlus': {
            const { PUSH_PLUS_TOKEN, PUSH_PLUS_TEMPLATE_TYPE, PUSH_PLUS_CHANNEL_TYPE } = pushConfig.config
            const pushplus = new PushPlus(PUSH_PLUS_TOKEN)
            const response = await pushplus.send(title, desp, PUSH_PLUS_TEMPLATE_TYPE, PUSH_PLUS_CHANNEL_TYPE)
            return response
        }
        case 'IGot': {
            const { I_GOT_KEY } = pushConfig.config
            const iGot = new IGot(I_GOT_KEY)
            const response = await iGot.send(title, desp)
            return response
        }
        case 'Qmsg': {
            const { QMSG_KEY, QMSG_QQ, QMSG_PUSH_TYPE } = pushConfig.config
            const qmsg = new Qmsg(QMSG_KEY)
            const response = await qmsg.send(`${title}\n${desp}`, QMSG_QQ, QMSG_PUSH_TYPE)
            return response
        }
        case 'XiZhi': {
            const { XI_ZHI_KEY } = pushConfig.config
            const xiZhi = new XiZhi(XI_ZHI_KEY)
            const response = await xiZhi.send(title, desp)
            return response
        }
        case 'PushDeer': {
            const { PUSH_DEER_PUSH_KEY, PUSH_DEER_ENDPOINT, PUSH_DEER_PUSH_TYPE } = pushConfig.config
            const pushDeer = new PushDeer(PUSH_DEER_PUSH_KEY, PUSH_DEER_ENDPOINT)
            const response = await pushDeer.send(title, desp, PUSH_DEER_PUSH_TYPE)
            return response
        }
        case 'Discord': {
            const { DISCORD_WEBHOOK, DISCORD_USERNAME } = pushConfig.config
            const discord = new Discord(DISCORD_WEBHOOK, DISCORD_USERNAME)
            const response = await discord.send(`${title}\n${desp}`)
            return response
        }
        case 'Telegram': {
            const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = pushConfig.config
            const telegram = new Telegram({
                TELEGRAM_BOT_TOKEN,
                TELEGRAM_CHAT_ID: Number(TELEGRAM_CHAT_ID),
            })
            const response = await telegram.send(`${title}\n${desp}`)
            return response
        }
        case 'OneBot': {
            const { ONE_BOT_BASE_URL, ONE_BOT_ACCESS_TOKEN, ONE_BOT_MSG_TYPE, ONE_BOT_RECIEVER_ID } = pushConfig.config
            const oneBot = new OneBot(ONE_BOT_BASE_URL, ONE_BOT_ACCESS_TOKEN)
            const response = await oneBot.send(`${title}\n${desp}`, ONE_BOT_MSG_TYPE, Number(ONE_BOT_RECIEVER_ID))
            return response
        }
        default:
            throw new Error('未匹配到任何推送方式！')

    }
}
