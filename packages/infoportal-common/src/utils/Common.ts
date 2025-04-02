import {duration, Enum} from '@axanc/ts-utils'
import {NonNullableKeys} from '../type/Generic.js'
import {addMonths, differenceInMonths, isAfter, isBefore, startOfMonth} from 'date-fns'

export const generateId = () => ('' + Math.random()).split('.')[1]

export const capitalize = (_: string) => {
  return _.charAt(0).toUpperCase() + _.slice(1)
}

export const toPercent = <T extends number | undefined>(
  value: T,
  fractionDigits = 1,
): T extends undefined ? string | undefined : string => {
  return value !== undefined ? (value * 100).toFixed(fractionDigits) + '%' : (undefined as any)
}

export const objectToQueryString = (
  obj: {
    [key: string]: any
  } = {},
): string => {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        for (const item of value) {
          params.append(key, item.toString())
        }
      } else {
        params.set(key, value.toString())
      }
    }
  }
  return params.toString()
}

export const isDate = (value: any) => {
  return Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())
}

type PipeFunction = <T, R>(fn1: (arg: T) => R, ...fns: (((arg: R) => R) | undefined)[]) => (arg: T) => R

export const pipe: PipeFunction = (fn1, ...fns) => {
  return (arg) => fns.reduce((prev, fn) => (fn ? fn(prev) : prev), fn1(arg))
}

export class Chain<T> {
  constructor(private value?: T) {}

  readonly map = <B>(f: (t: T) => B): Chain<B> => {
    return new Chain<B>(this.value ? f(this.value) : undefined)
  }

  readonly get = (): T => this.value as T

  get val() {
    return this.value
  }

  readonly getOrElse = (orElse: () => T): T => {
    if (this.value) return this.value
    return orElse()
  }
}

export const chain = <T>(value?: T) => new Chain(value)

export const makeid = (length = 14) => {
  let result = ''
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const characters = letters + numbers
  const charactersLength = characters.length
  for (let i = 0; i < length - 1; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const multipleFilters = <T>(
  list: T[],
  filters: Array<undefined | boolean | ((value: T, index: number, array: T[]) => boolean)>,
) => {
  if (filters.length === 0) return list
  return list.filter((t: T, index: number, array: T[]) =>
    filters
      .filter((filter) => filter instanceof Function)
      // @ts-ignore
      .every((filter) => filter(t, index, array)),
  )
}

export const forceArrayStringInference = <T extends string>(a: T[]) => a

export const uppercaseHandlingAcronyms = (text: string): string => {
  const acronyms = ['HoHH', 'IDPs', 'PwD', 'PwDs', 'HHs', 'CoC', 'w/', 'PoC', 'PoCs', 'NFIs']
  text = text.toUpperCase()
  acronyms.forEach((_) => {
    text = text.replaceAll(_.toUpperCase(), _)
  })
  return text
}

export const convertNumberIndexToLetter = (_: number) => {
  return (_ + 9).toString(36).toUpperCase()
}

export const hash = (s: string, salt: string = '') => {
  const str = s + salt
  var hash = 0,
    i,
    chr
  if (str.length === 0) return hash
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }
  return hash >>> 0
}

export const removeAccent = (str: string): string => {
  const accentMap: Record<string, string> = {
    à: 'a',
    á: 'a',
    â: 'a',
    ã: 'a',
    ä: 'a',
    å: 'a',
    ç: 'c',
    è: 'e',
    é: 'e',
    ê: 'e',
    ë: 'e',
    ì: 'i',
    í: 'i',
    î: 'i',
    ï: 'i',
    ð: 'd',
    ñ: 'n',
    ò: 'o',
    ó: 'o',
    ô: 'o',
    õ: 'o',
    ö: 'o',
    ø: 'o',
    ù: 'u',
    ú: 'u',
    û: 'u',
    ü: 'u',
    ý: 'y',
    ÿ: 'y',
    ă: 'a',
    ć: 'c',
    đ: 'd',
    ē: 'e',
  }

  return str.replace(/[àáâãäåçèéêëìíîïðñòóôõöøùúûüýÿćđē]/g, (match) => accentMap[match] || match)
}

export const add = (...args: (string | number | undefined)[]) => {
  return args.reduce<number>((acc, _) => acc + safeNumber(_, 0), 0)
}

export const safeNumber: {
  (_: undefined | string | number, defaultValue?: undefined): number | undefined
  (_: undefined | string | number, defaultValue: number): number
} = (_, defaultValue) => (isNaN(_ as number) ? defaultValue : +_!) as number

export const safeInt32: {
  (_: undefined | string | number, defaultValue?: undefined): number | undefined
  (_: undefined | string | number, defaultValue: number): number
} = (_, defaultValue) => {
  const num = safeNumber(_, defaultValue!)
  if (num > 2147483647) return defaultValue
  return num as any
}

export const safeArray = <T extends string>(value?: T[]): T[] => {
  if (!value) return []
  if (Array.isArray(value)) return value.filter((_) => _ !== undefined && _ !== null)
  return [value]
}

export const removeHtml: {
  (_: string): string
  (_: undefined): undefined
  (_?: string): string | undefined
} = (_) => _?.replace(/(<([^>]+)>)/gi, '') as any

export const assert = (condition: any, msg?: string): asserts condition => {
  if (!condition) {
    throw new Error(msg)
  }
}

export const nullValuesToUndefined = <T extends Record<string | number, null | undefined | any>>(
  obj: T,
): NonNullableKeys<T> => {
  return new Enum(obj).transform((k, v) => [k as any, v === null ? undefined : v]).get() as any
}

export const slugify: {
  (_: string): string
  (_: undefined): undefined
  (_?: string): string | undefined
} = (_?: string) =>
  _?.replaceAll(/\s/g, '_')
    .replaceAll(/[éèê]/g, 'e')
    .replaceAll(/[àâ]/g, 'a')
    .replaceAll(/[^a-zA-Z0-9_-]/g, '') as any

export const logThen =
  (log: string) =>
  <T>(args: T): T => {
    console.log(log, args)
    return args
  }

export const openCanvasInNewTab = (canvas: HTMLCanvasElement, name: string) => {
  setTimeout(() => {
    // w.document.write('<static src="' + canvas.toDataURL('png') + '" />')
    canvas.toBlob((blob) => {
      const w = window.open(URL.createObjectURL(blob!), '_blank')!
      w.document.title = name
    })
    document.body.appendChild(canvas)
  }, 1000)
}

export const fnTry = <T>(fn: () => T) => {
  return {
    fnCatch: <C>(fnCatch: (e: Error) => C): T | C => {
      try {
        return fn()
      } catch (e: any) {
        return fnCatch(e)
      }
    },
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

export const logPerformance = <R, P extends Array<any>>({
  message,
  showResult,
  logger,
  fn,
}: {
  message: (...p: P) => string
  showResult?: (t: R) => string
  logger: (m: string) => void
  fn: (...p: P) => Promise<R>
}): ((...p: P) => Promise<R>) => {
  // }) => ({fn}: {fn: ((...p: P) => Promise<R>)}):((...p: P): Promise<R>) => {
  return async (...p: P) => {
    const start = performance.now()
    const m = message(...p) + '... '
    logger(m)
    const r = await fn(...p)
    logger(m + (showResult ? showResult(r) : '') + ' ' + duration(performance.now() - start).toString())
    return r
  }
}
