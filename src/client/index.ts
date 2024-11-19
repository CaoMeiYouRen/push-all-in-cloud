import {
    ConfigSchema,
    PushAllInOne,
} from 'push-all-in-one' // 假设你的类型定义在这个文件中
import { Option as AvueOption, Column as AvueColumn } from '@cao-mei-you-ren/avue-types'
/**
 * 将 ConfigSchema 转换为 Avue 表单的 option
 * @param schema 符合 ConfigSchema 的 Schema
 * @returns Avue 表单的 option
 */
export function convertToAvueOption<T extends ConfigSchema>(schema: T, name: string): AvueOption {
    const avueOption = {
        column: [],
    } as AvueOption

    for (const key in schema) {
        if (Object.prototype.hasOwnProperty.call(schema, key)) {
            const field = schema[key]
            const avueField: AvueColumn = {
                type: field.type,
                label: field.title || key,
                labelWidth: 150,
                prop: key,
                span: 24,
                rules: field.required ? [{ required: true, message: `请输入${field.title || key}`, trigger: 'blur' }] : [],
                value: field.default,
                tip: field.description,
            }

            if (field.type === 'select') {
                avueField.dicData = (field.options || []).map((option) => ({
                    label: option.label,
                    value: option.value,
                }))
            } else if (field.type === 'string') {
                avueField.type = 'input'
            } else if (field.type === 'boolean') {
                avueField.type = 'switch'
            } else if (field.type === 'object') {
                avueField.type = 'textarea'
            }
            avueOption.column.push(avueField)
        }
    }
    avueOption.title = name
    avueOption.submitText = '推送'
    avueOption.submitBtn = true
    return avueOption
}

export const pushAllInOneSchema = Object.fromEntries(Object.entries(PushAllInOne).map(([key, value]) => [key, {
    name: value.name?.replace('_', ''),
    namespace: value.namespace,
    configSchema: value.configSchema,
    optionSchema: value.optionSchema,
    avueConfig: convertToAvueOption(value.configSchema, value.namespace),
    avueOption: convertToAvueOption(value.optionSchema, value.namespace),
}]))
