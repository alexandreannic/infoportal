import React, {Dispatch, ReactNode, SetStateAction, useContext, useState} from 'react'
import {KoboEditModalOption, KoboUpdateModal, KoboUpdateModalType} from '@/shared/koboEdit/KoboUpdateModal'
import {KoboUpdateAnswers, KoboUpdateTag, KoboUpdateValidation} from '@/core/sdk/server/kobo/KoboAnswerSdk'
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
      | {
          target: 'tag'
          params: UpdateDialog.ById.Tag
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
      export type Tag = Omit<KoboUpdate.Update.ById.Tag, 'value'> & {
        type: KoboUpdateModalType
        options?: KoboEditModalOption[] | string[]
        onSuccess?: (params: KoboUpdateTag) => void
      }
    }
  }

  export namespace Update {
    export namespace ById {
      export type Tag = {
        formId: Kobo.FormId
        answerIds: Kobo.SubmissionId[]
        tag: string
        value: any
      }
      export type Answer = KoboUpdateAnswers
      export type Validation = KoboUpdateValidation
    }
  }
}

export interface KoboUpdateContext {
  asyncUpdateById: {
    tag: UseAsyncMultiple<(_: KoboUpdate.Update.ById.Tag) => Promise<void>>
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
    isTag,
    value,
    answerIds,
  }: {
    answerIds: Kobo.SubmissionId[]
    formId: string
    key: string
    isTag?: boolean
    value: any
  }) => {
    const idsIndex = new Set(answerIds)
    const currentAnswers = ctxAnswers.byId(formId).get
    if (!currentAnswers) return
    ctxAnswers.byId(formId).set({
      ...currentAnswers,
      data: currentAnswers.data.map((a) => {
        if (idsIndex.has(a.id)) {
          if (isTag) {
            if (!a.tags) a.tags = {}
            ;(a.tags as any)[key] = value
          } else a[key] = value
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
        isTag: false,
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

  const asyncUpdateTagById = useAsync(
    async (p: KoboUpdate.Update.ById.Tag) => {
      await api.kobo.answer
        .updateTag({
          answerIds: p.answerIds,
          formId: p.formId,
          tags: {[p.tag]: p.value},
        })
        .then(() => {
          _updateCacheById({
            formId: p.formId,
            key: p.tag,
            isTag: true,
            value: p.value,
            answerIds: p.answerIds,
          })
        })
        .catch((e) => {
          ctxAnswers.byId(p.formId).fetch({force: true, clean: false})
          return Promise.reject(e)
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
            data: currentAnswers.data.filter((a) => !idsIndex.has(a.id)),
          })
        })
        .catch((e) => {
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
          tag: asyncUpdateTagById,
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
          case 'tag':
            return (
              <KoboUpdateModal.Tag
                type={openDialog.params.type}
                formId={openDialog.params.formId}
                tag={openDialog.params.tag}
                options={openDialog.params.options}
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
