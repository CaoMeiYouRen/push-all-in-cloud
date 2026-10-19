import type { ConfigSchema } from 'push-all-in-one'
import { convertToAvueOption, pushAllInOneSchema } from './index'

describe('convertToAvueOption', () => {
    it('应把 ConfigSchema 转换为 Avue option', () => {
        const schema = {
            TOKEN: {
                type: 'string',
                title: '令牌',
                description: '推送令牌',
                required: true,
                default: 'default-token',
            },
            ENABLE: {
                type: 'boolean',
                required: false,
            },
            EXTRA: {
                type: 'object',
                required: false,
            },
            MODE: {
                type: 'select',
                required: false,
                options: [
                    { label: '文本', value: 'text' },
                    { label: 'Markdown', value: 'markdown' },
                ],
            },
        } as unknown as ConfigSchema

        const option = convertToAvueOption(schema, '测试推送')

        expect(option.title).toBe('测试推送')
        expect(option.submitText).toBe('推送')
        expect(option.submitBtn).toBe(true)

        const column = option.column ?? []
        expect(column).toHaveLength(4)

        const [token, enable, extra, mode] = column

        expect(token.prop).toBe('TOKEN')
        expect(token.type).toBe('input')
        expect(token.label).toBe('令牌')
        expect(token.tip).toBe('推送令牌')
        expect(token.value).toBe('default-token')
        expect(token.rules).toEqual([
            { required: true, message: '请输入令牌', trigger: 'blur' },
        ])

        // boolean 映射为 switch，且未提供 title 时回退到字段名
        expect(enable.type).toBe('switch')
        expect(enable.label).toBe('ENABLE')
        expect(enable.rules).toEqual([])

        // object 映射为 textarea
        expect(extra.type).toBe('textarea')

        // select 保留 dicData
        expect(mode.type).toBe('select')
        expect(mode.dicData).toEqual([
            { label: '文本', value: 'text' },
            { label: 'Markdown', value: 'markdown' },
        ])
    })

    it('select 类型未提供 options 时 dicData 应为空数组', () => {
        const schema = {
            MODE: {
                type: 'select',
                required: false,
            },
        } as unknown as ConfigSchema

        const { column = [] } = convertToAvueOption(schema, '空选项')

        expect(column[0].dicData).toEqual([])
    })
})

describe('pushAllInOneSchema', () => {
    it('应为每种推送方式生成 avue 配置与选项配置', () => {
        const keys = Object.keys(pushAllInOneSchema)
        expect(keys.length).toBeGreaterThan(0)

        keys.forEach((key) => {
            const item = pushAllInOneSchema[key]
            expect(typeof item.name).toBe('string')
            expect(item.namespace).toBeTruthy()
            expect(item.configSchema).toBeTruthy()
            expect(item.optionSchema).toBeTruthy()
            expect(item.avueConfig.title).toBe(item.namespace)
            expect(item.avueOption.title).toBe(item.namespace)
            expect(item.avueConfig.column?.length).toBe(Object.keys(item.configSchema).length)
            expect(item.avueOption.column?.length).toBe(Object.keys(item.optionSchema).length)
        })
    })
})
