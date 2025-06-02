import React, {Dispatch, ReactNode, SetStateAction, useContext, useState} from 'react'
import {KoboUpdateModal} from '@/shared/koboEdit/KoboUpdateModal'
import {KoboUpdateAnswers, KoboUpdateValidation} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {useKoboAnswersContext} from '@/core/context/KoboAnswersContext'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useAsync, UseAsyncMultiple} from '@/shared/hook/useAsync'
import {KoboSubmissionMetaData} from 'infoportal-common'
import {useIpToast} from '@/core/useToast'
import {Kobo} from 'kobo-sdk'

export namespace KoboUpdate {
  export namespace DialogParams {
    export type ById =
      | {
          target: 'answer'
          params: UpdateDialog.ById.Answer
        }
      | {
          target: 'validation'
          params: UpdateDialog.ById.Validation
        }
  }

  namespace UpdateDialog {
    export namespace ById {
      export type Answer<T extends Record<string, any> = any> = Omit<KoboUpdateAnswers<T>, 'answer'> & {
        onSuccess?: (params: KoboUpdateAnswers<T>) => void
      }
      export type Validation = Omit<KoboUpdateValidation, 'status'> & {
        onSuccess?: (params: KoboUpdateValidation) => void
      }
    }
  }

  export namespace Update {
    export namespace ById {
      export type Answer = KoboUpdateAnswers
      export type Validation = KoboUpdateValidation
    }
  }
}

export interface KoboUpdateContext {
  asyncUpdateById: {
    answer: UseAsyncMultiple<(_: KoboUpdate.Update.ById.Answer) => Promise<void>>
    validation: UseAsyncMultiple<(_: KoboUpdate.Update.ById.Validation) => Promise<void>>
  }
  asyncDeleteById: UseAsyncMultiple<(_: Pick<KoboUpdateAnswers, 'formId' | 'answerIds'>) => Promise<void>>
  openById: Dispatch<SetStateAction<KoboUpdate.DialogParams.ById | null>>
  close: () => void
}

const Context = React.createContext({} as KoboUpdateContext)

export const useKoboUpdateContext = () => useContext<KoboUpdateContext>(Context)

export const KoboUpdateProvider = ({children}: {children: ReactNode}) => {
  const {api} = useAppSettings()
  const {toastHttpError} = useIpToast()
  const [openDialog, setOpenDialog] = useState<KoboUpdate.DialogParams.ById | null>(null)
  const ctxAnswers = useKoboAnswersContext()

  const _updateCacheById = ({
    formId,
    key,
    value,
    answerIds,
  }: {
    answerIds: Kobo.SubmissionId[]
    formId: string
    key: string
    value: any
  }) => {
    const idsIndex = new Set(answerIds)
    const currentAnswers = ctxAnswers.byId(formId).get
    if (!currentAnswers) return
    ctxAnswers.byId(formId).set({
      ...currentAnswers,
      data: currentAnswers.data.map(a => {
        if (idsIndex.has(a.id)) {
          a[key] = value
        }
        return {...a}
      }),
    })
  }

  const _updateById = async (p: KoboUpdateAnswers) => {
    try {
      await api.kobo.answer.updateAnswers({
        answerIds: p.answerIds,
        answer: p.answer,
        formId: p.formId,
        question: p.question,
      })
      _updateCacheById({
        formId: p.formId,
        key: p.question,
        value: p.answer,
        answerIds: p.answerIds,
      })
    } catch (e) {
      toastHttpError(e)
      ctxAnswers.byId(p.formId).fetch({force: true, clean: false})
      return Promise.reject(e)
    }
  }

  const asyncUpdateAnswerById = useAsync(_updateById, {requestKey: ([_]) => _.formId})

  const asyncUpdateValidationById = useAsync(
    async (params: KoboUpdateValidation) => {
      await api.kobo.answer.updateValidation(params)
      const key: keyof KoboSubmissionMetaData = 'validationStatus'
      _updateCacheById({
        formId: params.formId,
        answerIds: params.answerIds,
        key,
        value: params.status,
      })
    },
    {requestKey: ([_]) => _.formId},
  )

  const asyncDeleteById = useAsync(
    async ({answerIds, formId}: Pick<KoboUpdateAnswers, 'answerIds' | 'formId'>) => {
      await api.kobo.answer
        .delete({
          answerIds: answerIds,
          formId: formId,
        })
        .then(() => {
          const idsIndex = new Set(answerIds)
          const currentAnswers = ctxAnswers.byId(formId).get
          if (!currentAnswers) return
          ctxAnswers.byId(formId).set({
            ...currentAnswers,
            data: currentAnswers.data.filter(a => !idsIndex.has(a.id)),
          })
        })
        .catch(e => {
          toastHttpError(e)
          ctxAnswers.byId(formId).fetch({force: true, clean: false})
          return Promise.reject(e)
        })
    },
    {requestKey: ([_]) => _.formId},
  )

  return (
    <Context.Provider
      value={{
        asyncDeleteById,
        asyncUpdateById: {
          answer: asyncUpdateAnswerById,
          validation: asyncUpdateValidationById,
        },
        openById: setOpenDialog,
        close: () => setOpenDialog(null),
      }}
    >
      {children}
      {(() => {
        if (!openDialog) return <></>
        switch (openDialog.target) {
          case 'answer':
            return (
              <KoboUpdateModal.Answer
                formId={openDialog.params.formId}
                columnName={openDialog.params.question}
                answerIds={openDialog.params.answerIds}
                onClose={() => setOpenDialog(null)}
                onUpdated={openDialog.params.onSuccess}
              />
            )
          case 'validation':
            return (
              <KoboUpdateModal.Validation
                formId={openDialog.params.formId}
                answerIds={openDialog.params.answerIds}
                onClose={() => setOpenDialog(null)}
                onUpdated={openDialog.params.onSuccess}
              />
            )
        }
      })()}
    </Context.Provider>
  )
}
