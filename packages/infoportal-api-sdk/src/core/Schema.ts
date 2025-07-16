import {z} from 'zod'
import {Permission} from './Permission'

const createZodEnumFromObject = <T extends Record<string, string>>(obj: T) => {
  const values = Object.values(obj)
  return z.enum(values as [T[keyof T], ...T[keyof T][]])
}

export type Meta = {
  access?: Permission.Requirements
}

export const makeMeta = (_: Meta) => _

export const schema = (() => {
  const uuid = z.string()
  const formId = z.string()
  return {
    uuid,
    formId,
  }
})()
