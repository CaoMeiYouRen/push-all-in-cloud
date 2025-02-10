import { AxiosResponse } from 'axios'
import { ServerChanTurbo, ServerChanV3, CustomEmail, Dingtalk, WechatRobot, WechatApp, PushPlus, IGot, Qmsg, XiZhi, PushDeer, Discord, OneBot, Telegram, CustomEmailType, PushDeerPushType, WechatRobotMsgType, WechatAppMsgType, PushPlusTemplateType, PushPlusChannelType, runPushAllInOne, DingtalkMsgType, OneBotMsgType, Feishu } from 'push-all-in-one'
import logger from './logger'

const warn = (text: string) => logger.warn(text)
const info = (text: string) => logger.info(text)
export type SendResponse = Partial<Pick<AxiosResponse<any>, 'data' | 'status' | 'statusText' | 'headers'>>
/**
 *
 * 从环境变量读取配置并批量推送
 * @author CaoMeiYouRen
 * @date 2023-10-25
 * @export
 * @param title
 * @param [desp]
 */
export async function batchPushAllInOne(title: string, desp?: string, env: Record<string, string> = process.env): Promise<PromiseSettledResult<SendResponse>[]> {
    const pushs: Promise<SendResponse>[] = []
    if (env.SERVER_CHAN_TURBO_SENDKEY) {
        // Server酱。官方文档：https://sct.ftqq.com/
        const serverChanTurbo = new ServerChanTurbo({
            SERVER_CHAN_TURBO_SENDKEY: env.SERVER_CHAN_TURBO_SENDKEY,
        })
        pushs.push(serverChanTurbo.send(title, desp, {}))
        info('Server酱·Turbo 已加入推送队列')
    } else {
        info('未配置 Server酱·Turbo，已跳过')
    }

    if (env.SERVER_CHAN_V3_SENDKEY) {
        const serverChanV3 = new ServerChanV3({
            SERVER_CHAN_V3_SENDKEY: env.SERVER_CHAN_V3_SENDKEY,
        })
        pushs.push(serverChanV3.send(title, desp, {}))
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
        pushs.push(customEmail.send(title, desp))
        info('自定义邮件 已加入推送队列')
    } else {
        info('未配置 自定义邮件，已跳过')
    }

    if (env.DINGTALK_ACCESS_TOKEN) {
        // 钉钉机器人。官方文档：https://developers.dingtalk.com/document/app/custom-robot-access
        const dingtalk = new Dingtalk({
            DINGTALK_ACCESS_TOKEN: env.DINGTALK_ACCESS_TOKEN,
            DINGTALK_SECRET: env.DINGTALK_SECRET,
        })
        pushs.push(dingtalk.send(title, desp, { msgtype: env.DINGTALK_MSG_TYPE as DingtalkMsgType || 'text' }))
        info('钉钉机器人 已加入推送队列')
    } else {
        info('未配置 钉钉机器人，已跳过')
    }

    if (env.WECHAT_ROBOT_KEY) {
        // 企业微信群机器人。官方文档：https://work.weixin.qq.com/help?person_id=1&doc_id=13376
        // 企业微信群机器人的使用需要两人以上加入企业，如果个人使用微信推送建议使用 企业微信应用+微信插件 推送
        const wechatRobot = new WechatRobot({
            WECHAT_ROBOT_KEY: env.WECHAT_ROBOT_KEY,
        })
        pushs.push(wechatRobot.send(title, desp, {
            msgtype: env.WECHAT_ROBOT_MSG_TYPE as WechatRobotMsgType || 'text',
        }))
        info('企业微信群机器人 已加入推送队列')
    } else {
        info('未配置 企业微信群机器人，已跳过')
    }

    if (env.WECHAT_APP_CORPID && env.WECHAT_APP_AGENTID && env.WECHAT_APP_SECRET) {
        // 企业微信应用推送，官方文档：https://work.weixin.qq.com/api/doc/90000/90135/90664
        const wechatApp = new WechatApp({
            WECHAT_APP_CORPID: env.WECHAT_APP_CORPID,
            WECHAT_APP_AGENTID: Number(env.WECHAT_APP_AGENTID),
            WECHAT_APP_SECRET: env.WECHAT_APP_SECRET,
        })
        pushs.push(wechatApp.send(title, desp, {
            msgtype: env.WECHAT_APP_MSG_TYPE as WechatAppMsgType || 'text',
            touser: env.WECHAT_APP_USERID || '@all',
        }))
        info('企业微信应用推送 已加入推送队列')
    } else {
        info('未配置 企业微信应用推送，已跳过')
    }

    if (env.FEISHU_APP_ID && env.FEISHU_APP_SECRET && env.FEISHU_RECEIVE_ID) {
        // 飞书应用推送，官方文档：https://open.feishu.cn/document/client-docs/bot-v3/add-custom-bot
        const feishu = new Feishu({
            FEISHU_APP_ID: env.FEISHU_APP_ID,
            FEISHU_APP_SECRET: env.FEISHU_APP_SECRET,
        })
        pushs.push(feishu.send(title, desp, {
            receive_id_type: env.FEISHU_RECEIVE_ID_TYPE as any || 'open_id',
            receive_id: env.FEISHU_RECEIVE_ID,
            msg_type: env.FEISHU_MSG_TYPE as any || 'text',
        }))
    }

    if (env.PUSH_PLUS_TOKEN) {
        // pushplus 推送，官方文档：http://pushplus.hxtrip.com/doc/
        const pushplus = new PushPlus({
            PUSH_PLUS_TOKEN: env.PUSH_PLUS_TOKEN,
        })
        pushs.push(pushplus.send(title, desp, {
            template: env.PUSH_PLUS_TEMPLATE_TYPE as PushPlusTemplateType || 'html',
            channel: env.PUSH_PLUS_CHANNEL_TYPE as PushPlusChannelType || 'wechat',
        }))
        info('pushplus 推送 已加入推送队列')
    } else {
        info('未配置 pushplus 推送，已跳过')
    }

    if (env.I_GOT_KEY) {
        // iGot 推送，官方文档：https://wahao.github.io/Bark-MP-helper
        const iGot = new IGot({
            I_GOT_KEY: env.I_GOT_KEY,
        })
        pushs.push(iGot.send(title, desp, {}))
        info('iGot 推送 已加入推送队列')
    } else {
        info('未配置 iGot 推送，已跳过')
    }

    if (env.QMSG_KEY) {
        // Qmsg 酱 推送，官方文档：https://qmsg.zendee.cn
        const qmsg = new Qmsg({
            QMSG_KEY: env.QMSG_KEY,
        })
        pushs.push(qmsg.send(title, desp || '', {
            type: 'send',
            qq: env.QMSG_QQ || '',
        }))
        info('Qmsg 推送 已加入推送队列')
    } else {
        info('未配置 Qmsg 推送，已跳过')
    }

    if (env.XI_ZHI_KEY) {
        // 息知 推送，官方文档：https://xz.qqoq.net/#/index
        const xiZhi = new XiZhi({
            XI_ZHI_KEY: env.XI_ZHI_KEY,
        })
        pushs.push(xiZhi.send(title, desp))
        info('XiZhi 推送 已加入推送队列')
    } else {
        info('未配置 XiZhi 推送，已跳过')
    }

    if (env.PUSH_DEER_PUSH_KEY) {
        // 【推荐】PushDeer 推送，官方文档：https://github.com/easychen/pushdeer
        const pushDeer = new PushDeer({
            PUSH_DEER_PUSH_KEY: env.PUSH_DEER_PUSH_KEY,
            PUSH_DEER_ENDPOINT: env.PUSH_DEER_ENDPOINT,
        })
        pushs.push(pushDeer.send(title, desp, {
            type: env.PUSH_DEER_PUSH_TYPE as PushDeerPushType || 'markdown',
        }))
        info('PushDeer 推送 已加入推送队列')
    } else {
        info('未配置 PushDeer 推送，已跳过')
    }

    if (env.DISCORD_WEBHOOK) {
        // 【推荐】Discord Webhook 推送，官方文档：https://support.discord.com/hc/zh-tw/articles/228383668-%E4%BD%BF%E7%94%A8%E7%B6%B2%E7%B5%A1%E9%89%A4%E6%89%8B-Webhooks-
        const discord = new Discord({
            DISCORD_WEBHOOK: env.DISCORD_WEBHOOK,
        })
        pushs.push(discord.send(title, desp, {
            username: env.DISCORD_USERNAME,
        }))
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
        pushs.push(telegram.send(title, desp, {
            disable_notification: false,
        }))
        info('Telegram 推送 已加入推送队列')
    } else {
        info('未配置 Telegram 推送，已跳过')
    }

    if (env.ONE_BOT_BASE_URL && env.ONE_BOT_ACCESS_TOKEN) {
        // OneBot 推送。官方文档：https://github.com/botuniverse/onebot-11
        // 本项目实现的版本为 OneBot 11
        // 在 mirai 环境下实现的插件版本可参考：https://github.com/yyuueexxiinngg/onebot-kotlin
        const oneBot = new OneBot({
            ONE_BOT_BASE_URL: env.ONE_BOT_BASE_URL,
            ONE_BOT_ACCESS_TOKEN: env.ONE_BOT_ACCESS_TOKEN,
        })
        pushs.push(oneBot.send(title, desp || '',
            (env.ONE_BOT_MSG_TYPE as OneBotMsgType || 'private') === 'private' ? {
                message_type: 'private',
                user_id: Number(env.ONE_BOT_RECIEVER_ID),
            } : {
                message_type: 'group',
                group_id: Number(env.ONE_BOT_RECIEVER_ID),
            }),
        )
        info('OneBot 推送 已加入推送队列')
    } else {
        info('未配置 OneBot 推送，已跳过')
    }

    if (pushs.length === 0) {
        warn('未配置任何推送，请检查推送配置的环境变量！')
        return []
    }

    const results = await Promise.allSettled(pushs.map((push) => push.then((e) => {
        const { data, status, statusText, headers } = e
        return {
            data, status, statusText, headers,
        }
    })))
    const success = results.filter((e) => e.status === 'fulfilled')
    const fail = results.filter((e) => e.status === 'rejected')

    info(`本次共推送 ${results.length} 个，成功 ${success.length} 个，失败 ${fail.length} 个`)

    return results
}

export { runPushAllInOne }
