import * as yup from 'yup'

export const defaultPagination = {
  offset: 0,
  limit: 200000,
}

export const validateApiPaginate = yup.object({
  offset: yup.number(),
  limit: yup.number(),
})
