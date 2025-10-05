import {Ip} from 'infoportal-api-sdk'
import {Obj} from '@axanc/ts-utils'
import {WidgetTypeIcon} from '@/features/Dashboard/Widget/WidgetTypeIcon'
import React from 'react'
import {Core} from '@/shared'
import {useI18n} from '@infoportal/client-i18n'
import {Controller, useForm} from 'react-hook-form'

export type WidgetCreateForm = {
  type: Ip.Dashboard.Widget.Type
  //   questionName: string
}

export function WidgetCreate({
  loading,
  close,
  onSubmit,
}: {
  loading?: boolean
  onSubmit: (_: WidgetCreateForm) => void
  close: () => void
}) {
  // const {m} = useI18n()
  // const form = useForm<WidgetCreateForm>({mode: 'onChange'})

  return (
    <Core.RadioGroup<Ip.Dashboard.Widget.Type> onChange={_ => onSubmit({type: _})} inline sx={{mb: 2}}>
      {Obj.keys(Ip.Dashboard.Widget.Type).map(_ => (
        <Core.RadioGroupItem key={_} hideRadio value={_}>
          <WidgetTypeIcon type={_} sx={{my: 1, fontSize: '3em'}} />
        </Core.RadioGroupItem>
      ))}
    </Core.RadioGroup>
  )
  // return (
  //   <form onSubmit={_ => form.handleSubmit(onSubmit)(_).then(close)}>
  //     <Controller
  //       name="type"
  //       control={form.control}
  //       render={({field}) => (
  //         <Core.RadioGroup<Ip.Dashboard.Widget.Type> {...field} inline sx={{mb: 2}}>
  //           {Obj.keys(Ip.Dashboard.Widget.Type).map(_ => (
  //             <Core.RadioGroupItem key={_} hideRadio value={_}>
  //               <WidgetTypeIcon type={_} sx={{my: 1, fontSize: '3em'}} />
  //             </Core.RadioGroupItem>
  //           ))}
  //         </Core.RadioGroup>
  //       )}
  //     />
  //     <Core.Btn onClick={close}>{m.close}</Core.Btn>
  //     <Core.Btn type="submit" loading={loading} disabled={!form.formState.isValid}>
  //       {m.submit}
  //     </Core.Btn>
  //   </form>
  // )
}
