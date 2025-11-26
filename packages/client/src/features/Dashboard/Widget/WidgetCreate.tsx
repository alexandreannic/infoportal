import {Api} from '@infoportal/api-sdk'
import {Obj} from '@axanc/ts-utils'
import {WidgetTypeIcon} from '@/features/Dashboard/Widget/WidgetTypeIcon'
import React from 'react'
import {Core} from '@/shared'
import {useI18n} from '@infoportal/client-i18n'
import {Controller, useForm} from 'react-hook-form'

export type WidgetCreateForm = {
  type: Api.Dashboard.Widget.Type
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
    <Core.RadioGroup<Api.Dashboard.Widget.Type> onChange={_ => onSubmit({type: _})} inline sx={{mb: 2}}>
      {Obj.keys(Api.Dashboard.Widget.Type).map(_ => (
        <Core.RadioGroupItem key={_} hideRadio value={_}>
          <WidgetTypeIcon color="action" type={_} sx={{my: 1, fontSize: '2em'}} />
        </Core.RadioGroupItem>
      ))}
    </Core.RadioGroup>
  )
  // return (
  //   <form onSubmit={_ => form.handleSubmit(onSubmit)(_).then(close)}>
  //     <Controller
  //       name="module"
  //       control={form.control}
  //       render={({field}) => (
  //         <Core.RadioGroup<Api.Dashboard.Widget.Type> {...field} inline sx={{mb: 2}}>
  //           {Obj.keys(Api.Dashboard.Widget.Type).map(_ => (
  //             <Core.RadioGroupItem key={_} hideRadio value={_}>
  //               <WidgetTypeIcon module={_} sx={{my: 1, fontSize: '3em'}} />
  //             </Core.RadioGroupItem>
  //           ))}
  //         </Core.RadioGroup>
  //       )}
  //     />
  //     <Core.Btn onClick={close}>{m.close}</Core.Btn>
  //     <Core.Btn module="submit" loading={loading} disabled={!form.formState.isValid}>
  //       {m.submit}
  //     </Core.Btn>
  //   </form>
  // )
}
