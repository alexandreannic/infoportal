import {useSetState} from '@axanc/react-hooks'
import {useMutation, UseMutationOptions, UseMutationResult} from '@tanstack/react-query'

export function usePendingMutation<TData = unknown, TError = unknown, TVariables = unknown, TContext = unknown>({
  getId,
  ...options
}: UseMutationOptions<TData, TError, TVariables, TContext> & {
  getId: (_: TVariables) => string
}): UseMutationResult<TData, TError, TVariables, TContext> & {
  pendingIds: Set<string>
} {
  const pendingIds = useSetState<string>()
  const mutation = useMutation({
    ...options,
    onMutate: async (variables, ...args) => {
      pendingIds.add(getId(variables))
      return options.onMutate?.(variables, ...args)!
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      if (variables) {
        pendingIds.delete(getId(variables))
      }
      options.onSettled?.(data, error, variables, onMutateResult, context)
    },
  })
  return {...mutation, pendingIds: pendingIds.get}
}
