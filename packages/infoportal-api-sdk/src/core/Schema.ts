import {z} from 'zod'

const createZodEnumFromObject = <T extends Record<string, string>>(obj: T) => {
  const values = Object.values(obj)
  return z.enum(values as [T[keyof T], ...T[keyof T][]])
}

export const schema = (() => {
  const uuid = z.string()
  const formId = z.string()
  return {
    uuid,
    formId,
  }
})()
