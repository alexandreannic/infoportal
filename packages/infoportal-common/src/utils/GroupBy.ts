import {Enum, Obj, Seq, seq} from '@axanc/ts-utils'

type GroupByKey = string | number

export const groupBy: {
  <T extends Record<GroupByKey, any>, A extends GroupByKey, R extends any>(_: {
    data: T[]
    groups: [{by: (_: T) => A; sort?: (a: A, b: A) => number}]
    finalTransform: (_: Seq<T>, groups: [A]) => R
  }): {groups: Record<A, R>; transforms: R[]}

  <T extends Record<GroupByKey, any>, A extends GroupByKey, B extends GroupByKey, R extends any>(_: {
    data: T[]
    groups: [{by: (_: T) => A; sort?: (a: A, b: A) => number}, {by: (_: T) => B; sort?: (a: B, b: B) => number}]
    finalTransform: (_: Seq<T>, groups: [A, B]) => R
  }): {groups: Record<A, Record<B, R>>; transforms: R[]}

  <
    T extends Record<GroupByKey, any>,
    A extends GroupByKey,
    B extends GroupByKey,
    C extends GroupByKey,
    R extends any,
  >(_: {
    data: T[]
    groups: [
      {by: (_: T) => A; sort?: (a: A, b: A) => number},
      {by: (_: T) => B; sort?: (a: B, b: B) => number},
      {by: (_: T) => C; sort?: (a: C, b: C) => number},
    ]
    finalTransform: (_: Seq<T>, groups: [A, B, C]) => R
  }): {groups: Record<A, Record<B, Record<C, R>>>; transforms: R[]}

  <
    T extends Record<GroupByKey, any>,
    A extends GroupByKey,
    B extends GroupByKey,
    C extends GroupByKey,
    D extends GroupByKey,
    R extends any,
  >(_: {
    data: T[]
    groups: [
      {by: (_: T) => A; sort?: (a: A, b: A) => number},
      {by: (_: T, groups: [A]) => B; sort?: (a: B, b: B) => number},
      {by: (_: T, groups: [A, B]) => C; sort?: (a: C, b: C) => number},
      {by: (_: T, groups: [A, B, C]) => D; sort?: (a: D, b: D) => number},
    ]
    finalTransform: (_: Seq<T>, groups: [A, B, C, D]) => R
  }): {groups: Record<A, Record<B, Record<C, Record<D, R>>>>; transforms: R[]}

  <
    T extends Record<GroupByKey, any>,
    A extends GroupByKey,
    B extends GroupByKey,
    C extends GroupByKey,
    D extends GroupByKey,
    E extends GroupByKey,
    R extends any,
  >(_: {
    data: T[]
    groups: [
      {by: (_: T) => A; sort?: (a: A, b: A) => number},
      {by: (_: T, groups: [A]) => B; sort?: (a: B, b: B) => number},
      {by: (_: T, groups: [A, B]) => C; sort?: (a: C, b: C) => number},
      {by: (_: T, groups: [A, B, C]) => D; sort?: (a: D, b: D) => number},
      {by: (_: T, groups: [A, B, C, D]) => E; sort?: (a: E, b: E) => number},
    ]
    finalTransform: (_: Seq<T>, groups: [A, B, C, D, E]) => R
  }): {groups: Record<A, Record<B, Record<C, Record<D, Record<E, R>>>>>; transforms: R[]}

  <
    T extends Record<GroupByKey, any>,
    A extends GroupByKey,
    B extends GroupByKey,
    C extends GroupByKey,
    D extends GroupByKey,
    E extends GroupByKey,
    F extends GroupByKey,
    R extends any,
  >(_: {
    data: T[]
    groups: [
      {by: (_: T) => A; sort?: (a: A, b: A) => number},
      {by: (_: T, groups: [A]) => B; sort?: (a: B, b: B) => number},
      {by: (_: T, groups: [A, B]) => C; sort?: (a: C, b: C) => number},
      {by: (_: T, groups: [A, B, C]) => D; sort?: (a: D, b: D) => number},
      {by: (_: T, groups: [A, B, C, D]) => E; sort?: (a: E, b: E) => number},
      {by: (_: T, groups: [A, B, C, D, E]) => F; sort?: (a: F, b: F) => number},
    ]
    finalTransform: (_: Seq<T>, groups: [A, B, C, D, E, F]) => R
  }): {groups: Record<A, Record<B, Record<C, Record<D, Record<E, Record<E, F>>>>>>; transforms: R[]}

  <
    T extends Record<GroupByKey, any>,
    A extends GroupByKey,
    B extends GroupByKey,
    C extends GroupByKey,
    D extends GroupByKey,
    E extends GroupByKey,
    F extends GroupByKey,
    G extends GroupByKey,
    R extends any,
  >(_: {
    data: T[]
    groups: [
      {by: (_: T) => A; sort?: (a: A, b: A) => number},
      {by: (_: T, groups: [A]) => B; sort?: (a: B, b: B) => number},
      {by: (_: T, groups: [A, B]) => C; sort?: (a: C, b: C) => number},
      {by: (_: T, groups: [A, B, C]) => D; sort?: (a: D, b: D) => number},
      {by: (_: T, groups: [A, B, C, D]) => E; sort?: (a: E, b: E) => number},
      {by: (_: T, groups: [A, B, C, D, E]) => F; sort?: (a: F, b: F) => number},
      {by: (_: T, groups: [A, B, C, D, E, F]) => G; sort?: (a: G, b: G) => number},
    ]
    finalTransform: (_: Seq<T>, groups: [A, B, C, D, E, F, G]) => R
  }): {groups: Record<A, Record<B, Record<C, Record<D, Record<E, Record<E, Record<E, G>>>>>>>; transforms: R[]}

  // <T extends Record<GroupByKey, any>, A extends GroupByKey, B extends GroupByKey, C extends GroupByKey, D extends GroupByKey, E extends GroupByKey, R extends any>(_: {
  //   data: T[],
  //   groups: [
  //     {by: ((_: T) => A), sort?: (a: A, b: A) => number},
  //     {by: ((_: T) => B), sort?: (a: B, b: B) => number},
  //     {by: ((_: T) => C), sort?: (a: C, b: C) => number},
  //     {by: ((_: T) => D), sort?: (a: D, b: D) => number},
  //     {by: ((_: T) => E), sort?: (a: E, b: E) => number},
  //   ],
  //   finalTransform: (_: Seq<T>, groups: [A, B, C, D, E]) => R
  // }): {groups: Record<A, Record<B, Record<C, Record<D, Record<D, R>>>>>, transforms: R[]}

  <
    T extends Record<GroupByKey, any>,
    A extends GroupByKey,
    B extends GroupByKey,
    C extends GroupByKey,
    D extends GroupByKey,
    E extends GroupByKey,
    F extends GroupByKey,
    G extends GroupByKey,
    R extends any,
  >(_: {
    data: T[]
    groups: [
      {by: (_: T) => A; sort?: (a: A, b: A) => number},
      {by: (_: T, groups: [A]) => B; sort?: (a: B, b: B) => number},
      {by: (_: T, groups: [A, B]) => C; sort?: (a: C, b: C) => number},
      {by: (_: T, groups: [A, B, C]) => D; sort?: (a: D, b: D) => number},
      {by: (_: T, groups: [A, B, C, D]) => E; sort?: (a: E, b: E) => number},
      {by: (_: T, groups: [A, B, C, D, E]) => F; sort?: (a: F, b: F) => number},
      {by: (_: T, groups: [A, B, C, D, E, F]) => G; sort?: (a: G, b: G) => number},
    ]
    finalTransform: (_: Seq<T>, groups: [A, B, C, D, E, F, G]) => R
  }): {groups: Record<A, Record<B, Record<C, Record<D, Record<E, Record<E, Record<E, G>>>>>>>; transforms: R[]}

  <T extends Record<GroupByKey, any>>(_: {
    data: T[]
    groups: {by: (_: T) => GroupByKey; sort?: (a: string, b: string) => number}[]
    finalTransform: (_: Seq<T>, groups: GroupByKey[]) => any
  }): Record<GroupByKey, any>
} = ({data, groups, finalTransform, collectedGroup = []}: any) => {
  if (groups.length === 0) {
    const x = finalTransform(seq(data), collectedGroup)
    return {
      groups: x,
      transforms: [x],
    }
  }
  const [group, ...rest] = groups
  const res = seq(data).groupBy((_) => group.by(_, collectedGroup))
  const collectedTransforms: any[] = []
  const ress = new Enum(res)
    .sort(([a], [b]) => (group.sort ? group.sort(a, b) : a.localeCompare(b)))
    .transform((k, v) => {
      const gbb = groupBy({
        data: v,
        groups: rest,
        finalTransform,
        lastIndex: Obj.keys(res).length,
        collectedGroup: [...collectedGroup, k],
      } as any)
      collectedTransforms.push(...(gbb.transforms as any))
      return [k, gbb.groups]
    })
    .get() as Record<GroupByKey, any>
  return {
    groups: ress,
    transforms: collectedTransforms,
  }
}
