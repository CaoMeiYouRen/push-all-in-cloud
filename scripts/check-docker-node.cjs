/* eslint-disable no-console */
const fs = require('fs')

/**
 * 安全更新后的最低可用 Node.js 版本（与 package.json engines 保持一致）。
 * 低于这些版本的运行时缺少 2026-10-21 Node.js 安全更新（含 Brotli、TLS、DNS 等 CVE）。
 */
const REQUIRED_MINIMUM_VERSIONS = [
    [22, 23, 4],
    [24, 22, 1],
    [26, 12, 1],
]

const LATEST_REQUIRED_MAJOR = REQUIRED_MINIMUM_VERSIONS[REQUIRED_MINIMUM_VERSIONS.length - 1][0]

/** 匹配 Dockerfile 中的 node 基础镜像，如 `FROM node:26.12.1-alpine AS nodejs` */
const NODE_BASE_IMAGE_PATTERN = /^\s*FROM\s+(?:--platform=\S+\s+)?node:(\S+)/gim

/** 解析 `v26.12.1` / `26.12.1-alpine` 这类带补丁号的版本号，解析失败返回 null */
function parseVersion(version) {
    const matched = /^v?(\d+)\.(\d+)\.(\d+)/.exec(String(version || '').trim())
    if (!matched) {
        return null
    }
    return matched.slice(1, 4).map(Number)
}

function compareVersions(a, b) {
    for (let i = 0; i < 3; i++) {
        if (a[i] !== b[i]) {
            return a[i] - b[i]
        }
    }
    return 0
}

function isPatchedVersion(version) {
    const parsed = parseVersion(version)
    if (!parsed) {
        return false
    }
    const required = REQUIRED_MINIMUM_VERSIONS.find((minimum) => minimum[0] === parsed[0])
    if (!required) {
        // 比已记录的最新大版本还新（如 27.x），视为已包含安全更新
        return parsed[0] > LATEST_REQUIRED_MAJOR
    }
    return compareVersions(parsed, required) >= 0
}

function requiredVersionsText() {
    return REQUIRED_MINIMUM_VERSIONS.map((version) => `${version.join('.')}+`).join(' / ')
}

function fail(message) {
    console.error(message)
    return false
}

function checkVersion(version, label) {
    const suffix = label ? ` (${label})` : ''
    if (!isPatchedVersion(version)) {
        return fail(`Patched Node.js (${requiredVersionsText()}) is required, got ${version}${suffix}`)
    }
    console.log(`Node.js ${version}${suffix} meets the security baseline (${requiredVersionsText()})`)
    return true
}

function extractNodeBaseImageTags(dockerfileContent) {
    const tags = []
    let matched = null
    NODE_BASE_IMAGE_PATTERN.lastIndex = 0
    while ((matched = NODE_BASE_IMAGE_PATTERN.exec(dockerfileContent))) {
        tags.push(matched[1])
    }
    return tags
}

/** `26.12.1-alpine` -> `26.12.1`，未固定补丁号时返回 null */
function imageTagToVersion(tag) {
    return parseVersion(tag.split('-')[0])
}

/**
 * 冒烟测试：不构建镜像，直接校验 Dockerfile 中 node 基础镜像的补丁版本。
 * @param {string} filePath Dockerfile 路径
 */
function checkDockerfile(filePath) {
    if (!fs.existsSync(filePath)) {
        return fail(`Dockerfile not found: ${filePath}`)
    }
    const tags = extractNodeBaseImageTags(fs.readFileSync(filePath, 'utf8'))
    if (!tags.length) {
        return fail(`No node base image found in ${filePath}`)
    }
    return tags.every((tag) => {
        const version = imageTagToVersion(tag)
        if (!version) {
            return fail(`Base image node:${tag} must pin an exact patch version, e.g. node:26.12.1-alpine`)
        }
        return checkVersion(version.join('.'), `node:${tag}`)
    })
}

/**
 * 用法：
 *   node scripts/check-docker-node.cjs                     # 校验当前运行时（镜像构建时使用）
 *   node scripts/check-docker-node.cjs 26.12.0             # 校验指定版本
 *   node scripts/check-docker-node.cjs --dockerfile Dockerfile  # 校验 Dockerfile 基础镜像（CI 冒烟测试）
 */
function main(argv) {
    const dockerfileIndex = argv.indexOf('--dockerfile')
    if (dockerfileIndex !== -1) {
        return checkDockerfile(argv[dockerfileIndex + 1] || 'Dockerfile')
    }
    const versionArg = argv.find((arg) => !arg.startsWith('-'))
    return checkVersion(versionArg || process.versions.node, versionArg ? 'argument' : 'runtime')
}

if (require.main === module) {
    process.exit(main(process.argv.slice(2)) ? 0 : 1)
}

module.exports = {
    REQUIRED_MINIMUM_VERSIONS,
    parseVersion,
    compareVersions,
    isPatchedVersion,
    requiredVersionsText,
    extractNodeBaseImageTags,
    imageTagToVersion,
    checkDockerfile,
    main,
}
