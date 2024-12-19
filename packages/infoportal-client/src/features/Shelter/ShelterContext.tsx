import React, {ReactNode, useContext} from 'react'
import {KoboSchemaHelper, Shelter_nta} from 'infoportal-common'
import {UseShelterData} from '@/features/Shelter/useShelterData'
import {AccessSum} from '@/core/sdk/server/access/Access'
import {KoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Kobo} from 'kobo-sdk'

export type ShelterContext = Pick<KoboSchemaContext, 'langIndex' | 'setLangIndex'> & {
  access: AccessSum
  data: UseShelterData
  allowedOffices: Shelter_nta.T['back_office'][]
  asyncEdit: (formId: Kobo.FormId, answerId: Kobo.SubmissionId) => string
  nta: {
    schema: KoboSchemaHelper.Bundle
  }
  ta: {
    schema: KoboSchemaHelper.Bundle
  }
}

const Context = React.createContext({} as ShelterContext)

export const useShelterContext = () => useContext<ShelterContext>(Context)

export const ShelterProvider = ({
  schemaTa,
  schemaNta,
  children,
  allowedOffices,
  access,
  data,
  ...props
}: {
  access: AccessSum
  data: UseShelterData
  schemaTa: KoboSchemaHelper.Bundle
  schemaNta: KoboSchemaHelper.Bundle
  children: ReactNode
  allowedOffices: ShelterContext['allowedOffices']
} & Pick<KoboSchemaContext, 'langIndex' | 'setLangIndex'>) => {
  const {api} = useAppSettings()
  const asyncEdit = (formId: Kobo.FormId, answerId: Kobo.SubmissionId) => api.koboApi.getEditUrl({formId, answerId})

  return (
    <Context.Provider value={{
      access,
      asyncEdit,
      nta: {
        schema: schemaNta,
      },
      ta: {
        schema: schemaTa,
      },
      data,
      allowedOffices,
      ...props,
    }}>
      {children}
    </Context.Provider>
  )
}
