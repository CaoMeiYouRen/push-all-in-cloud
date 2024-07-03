<h1 align="center">push-all-in-cloud </h1>
<p>
  <img alt="Version" src="https://img.shields.io/github/package-json/v/CaoMeiYouRen/push-all-in-cloud.svg" />
  <a href="https://hub.docker.com/r/caomeiyouren/push-all-in-cloud" target="_blank">
    <img alt="Docker Pulls" src="https://img.shields.io/docker/pulls/caomeiyouren/push-all-in-cloud">
  </a>
  <a href="https://github.com/CaoMeiYouRen/push-all-in-cloud/actions?query=workflow%3ARelease" target="_blank">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/CaoMeiYouRen/push-all-in-cloud/release.yml?branch=master">
  </a>
  <img src="https://img.shields.io/badge/node-%3E%3D18-blue.svg" />
  <a href="https://github.com/CaoMeiYouRen/push-all-in-cloud#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/CaoMeiYouRen/push-all-in-cloud/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/CaoMeiYouRen/push-all-in-cloud/blob/master/LICENSE" target="_blank">
    <img alt="License: AGPL--3.0" src="https://img.shields.io/github/license/CaoMeiYouRen/push-all-in-cloud?color=yellow" />
  </a>
</p>



> 基于 push-all-in-one 和 hono 开发的云函数推送服务。支持 nodejs/docker/vercel 等部署方式

## 🏠 主页

[https://github.com/CaoMeiYouRen/push-all-in-cloud#readme](https://github.com/CaoMeiYouRen/push-all-in-cloud#readme)


## 📦 依赖要求


- node >=16

## 🚀 安装

TODO

## 👨‍💻 使用

### 接口说明

| 路径     | 请求方法 | 请求格式         | 请求内容    | 响应内容        | 说明                                                         |
| -------- | -------- | ---------------- | ----------- | --------------- | ------------------------------------------------------------ |
| /push    | POST     | application/json | PushBody    | PushResponse    | 将消息推送到服务端配置的多个推送渠道。使用本方式需要配置环境变量 |
| /forward | POST     | application/json | ForwardBody | ForwardResponse | 将消息转发到目标推送渠道。使用本方式无需配置环境变量，但需要在推送时设置推送渠道 |

```ts
type PushBody = {
    title: string
    desp?: string
}
type ForwardBody = {
    title: string
    desp?: string
    type: PushType
    config: Record<string,string>
}
type PushResponse = {
    message: string
    data: PromiseSettledResult<Pick<AxiosResponse<any>, 'data' | 'headers' | 'status' | 'statusText'>>[]
}
type ForwardResponse = {
    message: string
    data: Pick<AxiosResponse<any>, 'data' | 'headers' | 'status' | 'statusText'>
}
```



### 环境变量配置

| 环境变量                | 说明                                                         |
| ----------------------- | ------------------------------------------------------------ |
| PORT                    | 运行端口                                                     |
| AUTH_PUSH_KEY           | 【建议设置】访问 /push 路由，执行推送请求需要的 key。验证方式为 `Bearer Auth`。由于该路由需要在环境变量配置推送渠道，所以不设置该项将有接口被盗刷的风险。 |
| AUTH_FORWARD_KEY        | 访问 /forward 路由，执行转发推送需要的 key。验证方式为 `Bearer Auth`。 |
| SCTKEY                  | Server酱·Turbo  SCTKEY。官方文档：https://sct.ftqq.com/      |
| EMAIL_AUTH_USER         | 自定义邮箱。发件邮箱                                         |
| EMAIL_AUTH_PASS         | 发件授权码(或密码)                                           |
| EMAIL_HOST              | 发件域名                                                     |
| EMAIL_PORT              | 发件端口                                                     |
| EMAIL_TO_ADDRESS        | 收件邮箱                                                     |
| DINGTALK_ACCESS_TOKEN   | 【推荐】钉钉机器人 access_token。官方文档：https://developers.dingtalk.com/document/app/custom-robot-access |
| DINGTALK_SECRET         | 钉钉机器人加签安全秘钥（HmacSHA256）                         |
| WX_ROBOT_KEY            | 企业微信群机器人。官方文档：https://work.weixin.qq.com/help?person_id=1&doc_id=13376 |
| WX_ROBOT_MSG_TYPE       | 消息类型，默认 `text`                                        |
| WX_APP_CORPID           | 【推荐】企业微信企业ID，获取方式参考 https://work.weixin.qq.com/api/doc/90000/90135/91039#14953/corpid |
| WX_APP_AGENTID          | 企业应用的id。企业内部开发，可在应用的设置页面查看           |
| WX_APP_SECRET           | 应用的凭证密钥，获取方式参考：https://work.weixin.qq.com/api/doc/90000/90135/91039#14953/secret |
| WX_APP_USERID           | 指定接收消息的成员。若不指定则默认为 ”@all”。                |
| PUSH_PLUS_TOKEN         | pushplus 推送加开放平台。官方文档：http://pushplus.hxtrip.com/doc/ |
| PUSH_PLUS_TEMPLATE_TYPE | 发送消息模板，默认为 html                                    |
| I_GOT_KEY               | iGot 推送，官方文档：https://wahao.github.io/Bark-MP-helper  |
| QMSG_KEY                | Qmsg 酱 推送，官方文档：https://qmsg.zendee.cn               |
| XI_ZHI_KEY              | 息知 推送，官方文档：https://xz.qqoq.net/#/index             |
| PUSH_DEER_PUSH_KEY      | 【推荐】PushDeer 推送，官方文档：https://github.com/easychen/pushdeer |
| DISCORD_WEBHOOK         | 【推荐】Discord Webhook Url 可在服务器设置 -> 整合 -> Webhook -> 创建 Webhook 中获取。官方文档：https://support.discord.com/hc/zh-tw/articles/228383668-%E4%BD%BF%E7%94%A8%E7%B6%B2%E7%B5%A1%E9%89%A4%E6%89%8B-Webhooks- |
| DISCORD_USERNAME        | 机器人显示的名称                                             |
| TELEGRAM_BOT_TOKEN      | 【推荐】Telegram Bot 机器人令牌。您可以从 https://t.me/BotFather 获取 Token。官方文档：https://core.telegram.org/bots/api#making-requests |
| TELEGRAM_CHAT_ID        | 支持对话/群组/频道的 Chat ID。您可以转发消息到 https://t.me/JsonDumpBot 获取 Chat ID |
| ONE_BOT_BASE_URL        | OneBot 推送。OneBot HTTP 基础路径。官方文档：https://github.com/botuniverse/onebot-11 |
| ONE_BOT_ACCESS_TOKEN    | OneBot AccessToken                                           |
| ONE_BOT_MSG_TYPE        | 消息类型                                                     |
| ONE_BOT_RECIEVER_ID     | 用户/群组 ID，即 QQ 号或群号                                 |

## 🛠️ 开发

```sh
npm run dev
```

## 🔧 编译

```sh
npm run build
```

## 🔍 Lint

```sh
npm run lint
```


## 👤 作者


**CaoMeiYouRen**

* Website: [https://blog.cmyr.ltd/](https://blog.cmyr.ltd/)

* GitHub: [@CaoMeiYouRen](https://github.com/CaoMeiYouRen)


## 🤝 贡献

欢迎 贡献、提问或提出新功能！<br />如有问题请查看 [issues page](https://github.com/CaoMeiYouRen/push-all-in-cloud/issues). <br/>贡献或提出新功能可以查看[contributing guide](https://github.com/CaoMeiYouRen/push-all-in-cloud/blob/master/CONTRIBUTING.md).

## 💰 支持

如果觉得这个项目有用的话请给一颗⭐️，非常感谢

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=CaoMeiYouRen/push-all-in-cloud&type=Date)](https://star-history.com/#CaoMeiYouRen/push-all-in-cloud&Date)

## 📝 License

Copyright © 2024 [CaoMeiYouRen](https://github.com/CaoMeiYouRen).<br />
This project is [AGPL-3.0](https://github.com/CaoMeiYouRen/push-all-in-cloud/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [cmyr-template-cli](https://github.com/CaoMeiYouRen/cmyr-template-cli)_
