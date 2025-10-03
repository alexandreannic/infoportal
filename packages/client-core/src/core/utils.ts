import {addMonths, differenceInMonths, isAfter, isBefore, startOfMonth} from 'date-fns'
import {isValidElement, ReactElement, ReactNode} from 'react'

export const stableStringify = (obj: any): string => {
  return JSON.stringify(obj, Object.keys(obj).sort())
}

export const clearParenthesis = (_: string) => _.replaceAll(/(.*)\([^(]*\)/g, '$1')

export const sortObjectKeysDeep = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeysDeep)
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortObjectKeysDeep(obj[key])
        return acc
      }, {} as any)
  }
  return obj
}

export const extractInnerText = (node: ReactNode | ReactElement): string => {
  // @ts-ignore
  if ((node as ReactElement)?.props?.value) return (node as ReactElement).props.value
  if (typeof node === 'string') {
    return node
  }
  // @ts-ignore
  if (!node || !isValidElement(node) || !node.props || !node.props.children) {
    return ''
  }
  // @ts-ignore
  if (Array.isArray(node.props.children)) {
    // @ts-ignore
    return node.props.children.map(extractInnerText).join('')
  }
  // @ts-ignore
  return extractInnerText(node.props.children)
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

export const downloadBufferAsFile = (buffer: Buffer, filename: string) => {
  const _ = document.createElement('a')
  const content = new Blob([buffer as any])
  const encodedUri = window.URL.createObjectURL(content)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', filename)
  link.click()
  URL.revokeObjectURL(link.href)
}

export const downloadStringAsFile = (stringData: string, fileName: string) => {
  const _ = document.createElement('a')
  _.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(stringData))
  _.setAttribute('download', fileName)
  _.click()
}

export const openCanvasInNewTab = (canvas: HTMLCanvasElement, name: string) => {
  setTimeout(() => {
    // w.document.write('<static src="' + canvas.toDataURL('png') + '" />')
    canvas.toBlob(blob => {
      const w = window.open(URL.createObjectURL(blob!), '_blank')!
      w.document.title = name
    })
  }, 1000)
}

export const stopPropagation =
  <
    E extends {
      preventDefault?: () => void
      stopPropagation?: () => void
    },
  >(
    action: (event: E) => any,
  ) =>
  (event: E) => {
    event.stopPropagation?.()
    event.preventDefault?.()
    action(event)
  }
