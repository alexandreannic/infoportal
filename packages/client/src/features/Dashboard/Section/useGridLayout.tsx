import {Ip} from 'infoportal-api-sdk'
import {useMemo} from 'react'
import {ResponsiveProps} from 'react-grid-layout'

export const useGridLayout = (
  widgets: Ip.Dashboard.Widget[],
): Pick<ResponsiveProps, 'layouts' | 'breakpoints' | 'cols' | 'margin' | 'rowHeight' | 'width'> => {
  return useMemo(() => {
    const lg = widgets.map(_ => ({i: _.id, ..._.position}))
    const max = Math.max(...widgets.map(_ => _.position.h + _.position.y))
    const sm = widgets.map((w, i) => {
      let x = w.position.x
      let y = w.position.y
      if (x >= 6) {
        x = x - 6
        y = y + max + 1
      }
      return {
        i: w.id,
        ...w.position,
        x,
        y,
      }
    })
    return {
      layouts: {lg, sm},
      breakpoints: {lg: 1200, md: 769, sm: 768, xs: 480, xxs: 0},
      cols: {lg: 12, md: 12, sm: 6, xs: 6, xxs: 6},
      margin: [8, 8],
      rowHeight: 10,
      width: 1200,
    }
  }, [widgets])
}
