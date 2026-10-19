'use strict'

/**
 * 单元测试环境下的代理库替身。
 *
 * push-all-in-one 的 CJS 产物会顶层 `require('https-proxy-agent')` 与
 * `require('socks-proxy-agent')`，而这两个包（含其依赖 agent-base、
 * proxy-agent-negotiate）都是 ESM-only，jest 的 CJS 运行时无法加载。
 * 单元测试不涉及代理转发，因此这里用最小替身替换。
 * 仅在 jest 中通过 moduleNameMapper 生效，不影响运行时与构建产物。
 */
class ProxyAgent {
    constructor(url) {
        this.url = url
    }
}

module.exports = {
    HttpsProxyAgent: ProxyAgent,
    SocksProxyAgent: ProxyAgent,
}
