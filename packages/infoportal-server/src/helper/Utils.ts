import {v4} from 'uuid'
import {addMonths, differenceInMonths, format, isAfter, isBefore, startOfMonth} from 'date-fns'
import * as _yup from 'yup'
import {Obj} from '@axanc/ts-utils'

export const getObj = <K extends string, V extends any>(o: Record<K, V>, key: string): V | undefined => {
  // @ts-ignore
  return o[key]
}

export const yup = _yup

export const genUUID = v4

export const toYYYYMMDD = (_: Date) => format(_, 'yyyy-MM-dd') //_.toString().substring(0, 10)

export type MappedColumn<T, O = string> = {
  [P in keyof T]: T[P] extends undefined | Date | string | number | boolean | any[] ? O : MappedColumn<T[P], O>
}

export const previewList = (list: (string | number)[], toPrint = 1) => {
  const displayedItems = list.splice(0, toPrint).join(',')
  const rest = list.length - toPrint
  if (rest > 0) {
    return `${displayedItems} +${rest}`
  }
}

export const renameObjectProperties =
  <O>(propsMap: Partial<MappedColumn<O>>) =>
  (input: any): O => {
    return Obj.keys(propsMap).reduce((acc, key) => {
      if (typeof propsMap[key] === 'object') {
        return {
          ...acc,
          [key]: renameObjectProperties(propsMap[key]!)(input),
        }
      }
      return {
        ...acc,
        [key]: input[propsMap[key]],
      }
    }, {} as O)
  }

export const mapMultipleChoices = <T>(
  value: string | undefined,
  map: {[key: string]: T},
  defaultValue: T[] = [],
): T[] => {
  const res: T[] = []
  if (!value) {
    return defaultValue
  }
  Object.keys(map).forEach((k) => {
    if (value?.includes(k)) res.push(map[k])
  })
  return res
}

export const msToString = (duration: number) => format(duration, 'dd hh:mm:ss')

export async function processBatches<T>({
  data,
  batchSize,
  run,
}: {
  data: T[]
  batchSize: number
  run: (item: T[], index: number) => Promise<any>
}): Promise<void> {
  for (let i = 0; i < data.length; i += batchSize) {
    await run(data.slice(i, batchSize + i), i)
  }
}

export namespace Util {
  export const ensureArr = <T>(_: T | T[]): T[] => {
    return Array.isArray(_) ? _ : [_]
  }

  export const getObjectDiff = ({
    skipProperties = [],
    before,
    after,
  }: {
    skipProperties?: string[]
    before: Record<string, any>
    after: Record<string, any>
  }): Record<string, any> => {
    const updatedAnswers: Record<any, any> = {}

    function compareValues(key: string, oldValue: Record<any, any>, newValue: Record<any, any>): void {
      if (Array.isArray(oldValue) && Array.isArray(newValue)) {
        if (oldValue.length !== newValue.length) {
          updatedAnswers[key] = newValue
        } else {
          for (let i = 0; i < oldValue.length; i++) {
            if (JSON.stringify(oldValue[i]) !== JSON.stringify(newValue[i])) {
              updatedAnswers[key] = newValue
              break
            }
          }
        }
      } else if (
        typeof oldValue === 'object' &&
        oldValue !== null &&
        typeof newValue === 'object' &&
        newValue !== null
      ) {
        const nestedUpdates = Util.getObjectDiff({before: oldValue, after: newValue, skipProperties})
        if (Object.keys(nestedUpdates).length > 0) {
          updatedAnswers[key] = newValue
        }
      } else if (oldValue !== newValue) {
        updatedAnswers[key] = newValue
      }
    }

    for (const key in before) {
      if (after.hasOwnProperty(key) && !skipProperties.includes(key)) {
        compareValues(key, before[key], after[key])
      }
    }
    for (const key in after) {
      if (!before.hasOwnProperty(key) && !skipProperties.includes(key)) {
        updatedAnswers[key] = after[key]
      }
    }
    return updatedAnswers
  }

  export const promiseSequentially = async <T>(promises: (() => Promise<T>)[]): Promise<T[]> => {
    const results: T[] = []
    for (const promise of promises) {
      const result = await promise()
      results.push(result)
    }
    return results
  }

  export const logThen =
    (log: string) =>
    <T>(args: T): T => {
      console.log(log, args)
      return args
    }

  export const removeUndefined = <T extends object>(t: T): T => {
    for (const i in t) {
      if (t[i] === undefined || t[i] === null) {
        delete t[i]
      }
    }
    return t
  }
}

export const getOverlapMonths = (startDate1: Date, endDate1: Date, startDate2: Date, endDate2: Date) => {
  const start1 = startOfMonth(startDate1)
  const end1 = startOfMonth(endDate1)
  const start2 = startOfMonth(startDate2)
  const end2 = startOfMonth(endDate2)

  const overlapStart = isBefore(start1, start2) ? start2 : start1
  const overlapEnd = isAfter(end1, end2) ? end2 : end1

  const overlapMonths = differenceInMonths(addMonths(overlapEnd, 1), overlapStart)

  return overlapMonths > 0 ? overlapMonths : 0
}
