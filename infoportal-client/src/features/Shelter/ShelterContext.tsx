import React, {ReactNode, useContext} from 'react'
import {KoboAnswerId, KoboId, KoboSchemaHelper, Shelter_NTA} from '@infoportal-common'
import {UseShelterData} from '@/features/Shelter/useShelterData'
import {AccessSum} from '@/core/sdk/server/access/Access'
import {KoboSchemaContext} from '@/features/KoboSchema/KoboSchemaContext'
import {useAppSettings} from '@/core/context/ConfigContext'
import {JsonStoreShelterContractor} from '@/core/sdk/server/jsonStore/JsonStoreSdk'

export type ShelterContext = Pick<KoboSchemaContext, 'langIndex' | 'setLangIndex'> & {
  contractors: JsonStoreShelterContractor[]
  access: AccessSum
  data: UseShelterData
  allowedOffices: Shelter_NTA.T['back_office'][]
  asyncEdit: (formId: KoboId, answerId: KoboAnswerId) => string
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
  contractors,
  children,
  allowedOffices,
  access,
  data,
  ...props
}: {
  contractors: JsonStoreShelterContractor[]
  access: AccessSum
  data: UseShelterData
  schemaTa: KoboSchemaHelper.Bundle
  schemaNta: KoboSchemaHelper.Bundle
  children: ReactNode
  allowedOffices: ShelterContext['allowedOffices']
} & Pick<KoboSchemaContext, 'langIndex' | 'setLangIndex'>) => {
  const {api} = useAppSettings()
  const asyncEdit = (formId: KoboId, answerId: KoboAnswerId) => api.koboApi.getEditUrl({formId, answerId})
  return (
    <Context.Provider value={{
      access,
      contractors,
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
