import React, {Dispatch, ReactNode, SetStateAction, useContext, useState} from 'react'
import {KoboEditModalAnswer} from '@/shared/koboEdit/KoboEditModal'
import {KoboUpdateAnswers} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {useKoboAnswersContext} from '@/core/context/KoboAnswersContext'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useAsync, UseAsyncMultiple} from '@/shared/hook/useAsync'
import {InferTypedAnswer, KoboFormNameMapped} from '@/core/sdk/server/kobo/KoboTypedAnswerSdk'
import {KoboIndex} from 'infoportal-common'
import {KeyOf} from '@alexandreannic/ts-utils'
import {useIpToast} from '@/core/useToast'
import {Kobo} from 'kobo-sdk'

interface EditDataParams<T extends Record<string, any> = any> extends Omit<KoboUpdateAnswers<T>, 'answer'> {
  onSuccess?: (params: KoboUpdateAnswers<T>) => void
}

interface KoboUpdateAnswersByName<T extends KoboFormNameMapped, K extends KeyOf<InferTypedAnswer<T>>> {
  formName: T
  answerIds: Kobo.SubmissionId[]
  question: K
  answer: InferTypedAnswer<T>[K] | null
}

export interface KoboEditAnswersContext {
  asyncUpdateByName: UseAsyncMultiple<<T extends KoboFormNameMapped, K extends KeyOf<InferTypedAnswer<T>>>(_: KoboUpdateAnswersByName<T, K>) => Promise<void>>
  asyncUpdateById: UseAsyncMultiple<(_: KoboUpdateAnswers) => Promise<void>>
  asyncDeleteById: UseAsyncMultiple<(_: Pick<KoboUpdateAnswers, 'formId' | 'answerIds'>) => Promise<void>>
  open: Dispatch<SetStateAction<EditDataParams | undefined>>
  close: () => void
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
  const [editPopup, setEditPopup] = useState<EditDataParams | undefined>()
  const ctxAnswers = useKoboAnswersContext()

  const updateCacheById = ({
    formId,
    question,
    answerIds,
    answer,
  }: KoboUpdateAnswers) => {
    const idsIndex = new Set(answerIds)
    const currentAnswers = ctxAnswers.byId(formId).get
    if (!currentAnswers) return
    ctxAnswers.byId(formId).set({
      ...currentAnswers, data: currentAnswers.data.map(a => {
        if (idsIndex.has(a.id)) {
          a[question] = answer
        }
        return {...a}
      })
    })
  }

  const updateCacheByName = <T extends KoboFormNameMapped, K extends KeyOf<InferTypedAnswer<T>>>({
    formName,
    question,
    answerIds,
    answer,
  }: KoboUpdateAnswersByName<T, K>) => {
    const idsIndex = new Set(answerIds)
    const currentAnswers = ctxAnswers.byName(formName).get
    if (!currentAnswers) return
    ctxAnswers.byName(formName).set({
      ...currentAnswers, data: currentAnswers.data.map((a: any) => {
        if (idsIndex.has(a.id)) {
          a[question] = answer
        }
        return {...a}
      })
    })
  }

  const asyncUpdateById = useAsync(async (p: KoboUpdateAnswers) => {
    try {
      await api.kobo.answer.updateAnswers({
        answerIds: p.answerIds,
        answer: p.answer,
        formId: p.formId,
        question: p.question,
      })
      updateCacheById(p)
    } catch (e) {
      toastHttpError(e)
      ctxAnswers.byId(p.formId).fetch({force: true, clean: false})
      return Promise.reject(e)
    }
  }, {requestKey: ([_]) => _.formId})

  const asyncUpdateByName = useAsync(async <T extends KoboFormNameMapped, K extends KeyOf<InferTypedAnswer<T>>>(p: KoboUpdateAnswersByName<T, K>) => {
    await api.kobo.answer.updateAnswers({
      answerIds: p.answerIds,
      answer: p.answer,
      formId: KoboIndex.byName(p.formName).id,
      question: p.question,
    }).then(() => {
      updateCacheByName(p)
    }).catch((e) => {
      toastHttpError(e)
      ctxAnswers.byName(p.formName).fetch({force: true, clean: false})
      return Promise.reject(e)
    })
  }, {requestKey: ([_]) => _.formName})

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
      asyncUpdateById,
      asyncUpdateByName,
      open: setEditPopup,
      close: () => setEditPopup(undefined)
    }}>
      {children}
      {editPopup && (
        <KoboEditModalAnswer
          formId={editPopup.formId}
          columnName={editPopup.question}
          answerIds={editPopup.answerIds}
          onClose={() => setEditPopup(undefined)}
          onUpdated={editPopup.onSuccess}
        />
      )}
    </Context.Provider>
  )
}
