export type UUID = string

export type PartialOnly<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type PartialExcept<T, K extends keyof T> = {
  [P in K]-?: T[P] // required keys
} & {
  [P in Exclude<keyof T, K>]?: T[P]
}
export type ValueOf<T> = T[keyof T]

export type KeyOf<T> = Extract<keyof T, string>

export type StateStatus = 'error' | 'warning' | 'info' | 'success' | 'disabled'

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Record<string, unknown> ? DeepReadonly<T[P]> : T[P]
}

export type ArrayValues<T extends ReadonlyArray<string>> = T[keyof T]

export type NullableKey<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: T[P] | undefined
}
export type NonNullableKey<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>
}

export type NonNullableKeys<T> = {
  [K in keyof T]-?: NonNullable<T[K]>
}

export type ReverseMap<T extends Record<keyof T, keyof any>> = {
  [P in T[keyof T]]: {
    [K in keyof T]: T[K] extends P ? K : never
  }[keyof T]
}

export type NullableFn<T> = {
  (_: T): T
  (_: undefined): undefined
  (_?: T): T | undefined
}
