import React, {Dispatch, ReactNode, SetStateAction, useContext, useState} from 'react'
import {KoboEditModal, KoboEditModalOption, KoboEditModalType} from '@/shared/koboEdit/KoboEditModal'
import {KoboUpdateAnswers, KoboUpdateValidation} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {useKoboAnswersContext} from '@/core/context/KoboAnswersContext'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useAsync, UseAsyncMultiple} from '@/shared/hook/useAsync'
import {InferTypedAnswer, KoboFormNameMapped} from '@/core/sdk/server/kobo/KoboTypedAnswerSdk'
import {KoboIndex, KoboSubmissionMetaData} from 'infoportal-common'
import {KeyOf} from '@alexandreannic/ts-utils'
import {useIpToast} from '@/core/useToast'
import {Kobo} from 'kobo-sdk'

namespace UpdateDialogParams {
  export interface Answer<T extends Record<string, any> = any> extends Omit<KoboUpdateAnswers<T>, 'answer'> {
    onSuccess?: (params: KoboUpdateAnswers<T>) => void
  }

  export interface Validation extends KoboUpdateValidation {
    onSuccess?: (params: KoboUpdateValidation) => void
  }

  export interface Tag<T extends Record<string, any> = any, K extends KeyOf<T> = KeyOf<T>> {
    tag: K
    type: KoboEditModalType
    formId: Kobo.FormId
    options?: KoboEditModalOption[] | string[]
    answerIds: Kobo.SubmissionId[]
    onSuccess?: (params: KoboUpdateAnswers<T>) => void
  }
}

export type DialogParams = {
  target: 'answer'
  params: UpdateDialogParams.Answer
} | {
  target: 'validation'
  params: UpdateDialogParams.Validation
} | {
  target: 'tag'
  params: UpdateDialogParams.Tag
}

interface KoboUpdateAnswersByName<T extends KoboFormNameMapped, K extends KeyOf<InferTypedAnswer<T>>> {
  formName: T
  answerIds: Kobo.SubmissionId[]
  question: K
  answer: InferTypedAnswer<T>[K] | null
}

export interface KoboEditAnswersContext {
  asyncUpdateById: {
    tag: UseAsyncMultiple<(_: KoboUpdateTagById) => Promise<void>>,
    answer: UseAsyncMultiple<(_: KoboUpdateAnswers) => Promise<void>>
    validation: UseAsyncMultiple<(_: KoboUpdateValidation) => Promise<void>>,
  },
  asyncUpdateByName: {
    tag: UseAsyncMultiple<<T extends KoboFormNameMapped, K extends KeyOf<NonNullable<InferTypedAnswer<T>['tags']>>>(_: KoboUpdateTagByName<T, K>) => Promise<void>>,
    answer: UseAsyncMultiple<<T extends KoboFormNameMapped, K extends KeyOf<InferTypedAnswer<T>>>(_: KoboUpdateAnswersByName<T, K>) => Promise<void>>,
  },
  asyncDeleteById: UseAsyncMultiple<(_: Pick<KoboUpdateAnswers, 'formId' | 'answerIds'>) => Promise<void>>
  open: Dispatch<SetStateAction<DialogParams | undefined>>
  close: () => void
}

interface KoboUpdateTagByName<T extends KoboFormNameMapped, K extends KeyOf<NonNullable<InferTypedAnswer<T>['tags']>>> {
  formName: T,
  answerIds: Kobo.SubmissionId[]
  tag: K
  value: NonNullable<InferTypedAnswer<T>['tags']>[K] | null // TODO ensure null is updating correctly in DB
}

interface KoboUpdateTagById {
  formId: Kobo.FormId,
  answerIds: Kobo.SubmissionId[]
  tag: string
  value: any
}

const Context = React.createContext({} as KoboEditAnswersContext)

export const useKoboEditAnswerContext = () => useContext<KoboEditAnswersContext>(Context)

export const KoboEditAnswersProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const {api} = useAppSettings()
  const {toastHttpError} = useIpToast()
  const [openDialog, setOpenDialog] = useState<DialogParams | undefined>()
  const ctxAnswers = useKoboAnswersContext()

  const _updateCacheById = ({
    formId,
    key,
    tag,
    value,
    answerIds,
  }: {
    answerIds: Kobo.SubmissionId[]
    formId: string
    key: string
    tag?: boolean
    value: any
  }) => {
    const idsIndex = new Set(answerIds)
    const currentAnswers = ctxAnswers.byId(formId).get
    if (!currentAnswers) return
    ctxAnswers.byId(formId).set({
      ...currentAnswers, data: currentAnswers.data.map(a => {
        if (idsIndex.has(a.id)) {
          if (tag) {
            if (!a.tags) a.tags = {};
            (a.tags as any)[key] = value
          } else a[key] = value
        }
        return {...a}
      })
    })
  }

  const _updateCacheByName = ({
    formName,
    key,
    isTag,
    value,
    answerIds,
  }: {
    answerIds: Kobo.SubmissionId[]
    formName: KoboFormNameMapped
    key: string
    isTag?: boolean
    value: any
  }) => {
    const idsIndex = new Set(answerIds)
    const currentAnswers = ctxAnswers.byName(formName).get
    if (!currentAnswers) return
    ctxAnswers.byName(formName).set({
      ...currentAnswers, data: currentAnswers.data.map((a: any) => {
        if (idsIndex.has(a.id)) {
          if (isTag) {
            if (!a.tags) a.tags = {};
            (a.tags as any)[key] = value
          } else a[key] = value
        }
        return {...a}
      })
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
      _updateCacheById(p)
    } catch (e) {
      toastHttpError(e)
      ctxAnswers.byId(p.formId).fetch({force: true, clean: false})
      return Promise.reject(e)
    }
  }

  const asyncUpdateAnswerById = useAsync(_updateById, {requestKey: ([_]) => _.formId})

  const asyncUpdateAnswerByName = useAsync(async <T extends KoboFormNameMapped, K extends KeyOf<InferTypedAnswer<T>>>(p: KoboUpdateAnswersByName<T, K>) => {
    await api.kobo.answer.updateAnswers({
      answerIds: p.answerIds,
      answer: p.answer,
      formId: KoboIndex.byName(p.formName).id,
      question: p.question,
    }).then(() => {
      _updateCacheByName(p)
    }).catch((e) => {
      toastHttpError(e)
      ctxAnswers.byName(p.formName).fetch({force: true, clean: false})
      return Promise.reject(e)
    })
  }, {requestKey: ([_]) => _.formName})

  const asyncUpdateValidationById = useAsync(async (p: KoboUpdateValidation) => {
    const validationKey: keyof KoboSubmissionMetaData = 'validationStatus'
    return _updateById({
      formId: p.formId,
      answerIds: p.answerIds,
      question: validationKey,
      answer: p.status,
    })
  }, {requestKey: ([_]) => _.formId})

  const asyncUpdateTagByName = useAsync(async <T extends KoboFormNameMapped, K extends KeyOf<NonNullable<InferTypedAnswer<T>['tags']>>>(p: KoboUpdateTagByName<T, K>) => {
    await api.kobo.answer.updateTag({
      answerIds: p.answerIds,
      formId: KoboIndex.byName(p.formName).id,
      tags: {[p.tag]: p.value},
    }).then(() => {
      _updateCacheByName({
        key: p.tag,
        answerIds: p.answerIds,
        value: p.value,
        formName: p.formName,
      })
    }).catch((e) => {
      ctxAnswers.byName(p.formName).fetch({force: true, clean: false})
      return Promise.reject(e)
    })
  }, {requestKey: ([_]) => _.formName})

  const asyncUpdateTagById = useAsync(async (p: KoboUpdateTagById) => {
    await api.kobo.answer.updateTag({
      answerIds: p.answerIds,
      formId: p.formId,
      tags: {[p.tag]: p.value},
    }).then(() => {
      _updateCacheById(p)
    }).catch((e) => {
      ctxAnswers.byId(p.formId).fetch({force: true, clean: false})
      return Promise.reject(e)
    })
  }, {requestKey: ([_]) => _.formId})


  const asyncDeleteById = useAsync(async ({answerIds, formId}: Pick<KoboUpdateAnswers, 'answerIds' | 'formId'>) => {
    await api.kobo.answer.delete({
      answerIds: answerIds,
      formId: formId,
    }).then(() => {
      const idsIndex = new Set(answerIds)
      const currentAnswers = ctxAnswers.byId(formId).get
      if (!currentAnswers) return
      ctxAnswers.byId(formId).set({
        ...currentAnswers, data: currentAnswers.data.filter(a => !idsIndex.has(a.id))
      })
    }).catch((e) => {
      toastHttpError(e)
      ctxAnswers.byId(formId).fetch({force: true, clean: false})
      return Promise.reject(e)
    })
  }, {requestKey: ([_]) => _.formId})

  return (
    <Context.Provider value={{
      asyncDeleteById,
      asyncUpdateById: {
        tag: asyncUpdateTagById,
        answer: asyncUpdateAnswerById,
        validation: asyncUpdateValidationById,
      },
      asyncUpdateByName: {
        tag: asyncUpdateTagByName,
        answer: asyncUpdateAnswerByName,
      },
      open: setOpenDialog,
      close: () => setOpenDialog(undefined)
    }}>
      {children}
      {(() => {
        if (!openDialog) return <></>
        switch (openDialog.target) {
          case 'answer':
            return (
              <KoboEditModal.Answer
                formId={openDialog.params.formId}
                columnName={openDialog.params.question}
                answerIds={openDialog.params.answerIds}
                onClose={() => setOpenDialog(undefined)}
                onUpdated={openDialog.params.onSuccess}
              />
            )
          case 'tag':
            return (
              <KoboEditModal.Tag
                type={openDialog.params.type}
                formId={openDialog.params.formId}
                tag={openDialog.params.tag}
                options={openDialog.params.options}
                answerIds={openDialog.params.answerIds}
                onClose={() => setOpenDialog(undefined)}
                onUpdated={openDialog.params.onSuccess}
              />
            )
          case 'validation':
            return (
              <KoboEditModal.Validation
                formId={openDialog.params.formId}
                answerIds={openDialog.params.answerIds}
                onClose={() => setOpenDialog(undefined)}
                onUpdated={openDialog.params.onSuccess}
              />
            )
        }
      })()}
    </Context.Provider>
  )
}
