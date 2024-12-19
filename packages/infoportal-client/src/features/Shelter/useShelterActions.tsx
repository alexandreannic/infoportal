import {KoboSchemaHelper} from 'infoportal-common'
import {Dispatch, SetStateAction} from 'react'
import {useAppSettings} from '@/core/context/ConfigContext'
import {Kobo} from 'kobo-sdk'
import {ShelterEntity} from '@/features/Shelter/shelterEntity'

export type UseShelterActions = ReturnType<typeof useShelterActions>

export const useShelterActions = ({
  formId,
  schema,
}: {
  schema: KoboSchemaHelper.Bundle
  formId: Kobo.FormId,
  setEntity: Dispatch<SetStateAction<ShelterEntity[] | undefined>>
}) => {
  const {api} = useAppSettings()
  const asyncEdit = (answerId: Kobo.SubmissionId) => api.koboApi.getEditUrl({formId, answerId})
  return {
    schema,
    asyncEdit,
  }
}
