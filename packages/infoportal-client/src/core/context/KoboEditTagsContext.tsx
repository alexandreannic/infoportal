import React, {Dispatch, ReactNode, SetStateAction, useContext, useState} from 'react'
import {KoboEditModal, KoboEditModalOption, KoboEditModalType} from '@/shared/koboEdit/KoboEditModal'
import {KoboUpdateAnswers} from '@/core/sdk/server/kobo/KoboAnswerSdk'
import {useKoboAnswersContext} from '@/core/context/KoboAnswersContext'
import {useAppSettings} from '@/core/context/ConfigContext'
import {useAsync, UseAsyncMultiple} from '@/shared/hook/useAsync'
import {InferTypedAnswer, KoboFormNameMapped} from '@/core/sdk/server/kobo/KoboTypedAnswerSdk'
import {KoboIndex} from 'infoportal-common'
import {KeyOf} from '@alexandreannic/ts-utils'
import {Kobo} from 'kobo-sdk/Kobo'

interface EditDataParams<T extends Record<string, any> = any, K extends KeyOf<T> = KeyOf<T>> {
  tag: K
  type: KoboEditModalType
  formId: Kobo.FormId
  options?: KoboEditModalOption[] | string[]
  answerIds: Kobo.SubmissionId[]
  onSuccess?: (params: KoboUpdateAnswers<T>) => void
}

interface EditDataParamsByName<T extends KoboFormNameMapped, K extends KeyOf<NonNullable<InferTypedAnswer<T>['tags']>>> {
  tag: K
  type: KoboEditModalType
  formName: T
  options?: KoboEditModalOption[] | string[]
  answerIds: Kobo.SubmissionId[]
  onSuccess?: (params: KoboUpdateAnswers<NonNullable<InferTypedAnswer<T>['tags']>>) => void
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

export interface KoboEditTagsContext {
  asyncUpdateById: UseAsyncMultiple<(_: KoboUpdateTagById) => Promise<void>>
  asyncUpdateByName: UseAsyncMultiple<<T extends KoboFormNameMapped, K extends KeyOf<NonNullable<InferTypedAnswer<T>['tags']>>>(_: KoboUpdateTagByName<T, K>) => Promise<void>>
  open: Dispatch<SetStateAction<EditDataParams | undefined>>
  openByName: <T extends KoboFormNameMapped, K extends KeyOf<NonNullable<InferTypedAnswer<T>['tags']>>>(_: EditDataParamsByName<T, K>) => void
  close: () => void
}

const Context = React.createContext({} as KoboEditTagsContext)

export const useKoboEditTagContext = () => useContext<KoboEditTagsContext>(Context)

export const KoboEditTagsProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const {api} = useAppSettings()
  const [editPopup, setEditPopup] = useState<EditDataParams | undefined>()
  const ctxAnswers = useKoboAnswersContext()

  const updateCacheByName = <T extends KoboFormNameMapped, K extends KeyOf<NonNullable<InferTypedAnswer<T>['tags']>>>({
    formName,
    answerIds,
    tag,
    value,
  }: KoboUpdateTagByName<T, K>) => {
    const idsIndex = new Set(answerIds)
    const currentAnswers = ctxAnswers.byName(formName).get
    if (!currentAnswers) return
    ctxAnswers.byName(formName).set({
      ...currentAnswers, data: currentAnswers.data.map((a: any) => {
        if (idsIndex.has(a.id)) {
          if (!a.tags) a.tags = {}
          a.tags[tag] = value
        }
        return {...a}
      })
    })
  }

  const updateCacheById = ({
    formId,
    answerIds,
    tag,
    value,
  }: KoboUpdateTagById) => {
    const idsIndex = new Set(answerIds)
    const currentAnswers = ctxAnswers.byId(formId).get
    if (!currentAnswers) return
    ctxAnswers.byId(formId).set({
      ...currentAnswers, data: currentAnswers.data.map((a: any) => {
        if (idsIndex.has(a.id)) {
          if (!a.tags) a.tags = {}
          a.tags[tag] = value
        }
        return {...a}
      })
    })
  }

  const asyncUpdateByName = useAsync(async <T extends KoboFormNameMapped, K extends KeyOf<NonNullable<InferTypedAnswer<T>['tags']>>>(p: KoboUpdateTagByName<T, K>) => {
    await api.kobo.answer.updateTag({
      answerIds: p.answerIds,
      formId: KoboIndex.byName(p.formName).id,
      tags: {[p.tag]: p.value},
    }).then(() => {
      updateCacheByName(p)
    }).catch((e) => {
      ctxAnswers.byName(p.formName).fetch({force: true, clean: false})
      return Promise.reject(e)
    })
  }, {requestKey: ([_]) => _.formName})

  const asyncUpdateById = useAsync(async (p: KoboUpdateTagById) => {
    await api.kobo.answer.updateTag({
      answerIds: p.answerIds,
      formId: p.formId,
      tags: {[p.tag]: p.value},
    }).then(() => {
      updateCacheById(p)
    }).catch((e) => {
      ctxAnswers.byId(p.formId).fetch({force: true, clean: false})
      return Promise.reject(e)
    })
  }, {requestKey: ([_]) => _.formId})

  const openByName = <T extends KoboFormNameMapped, K extends KeyOf<NonNullable<InferTypedAnswer<T>['tags']>>>({formName, ...p}: EditDataParamsByName<T, K>) => {
    setEditPopup({
      formId: KoboIndex.byName(formName).id,
      ...p,
    })
  }

  return (
    <Context.Provider value={{
      asyncUpdateById: asyncUpdateById,
      asyncUpdateByName: asyncUpdateByName,
      open: setEditPopup,
      openByName,
      close: () => setEditPopup(undefined)
    }}>
      {children}
      {editPopup && (
        <KoboEditModal.Tag
          type={editPopup.type}
          formId={editPopup.formId}
          tag={editPopup.tag}
          options={editPopup.options}
          answerIds={editPopup.answerIds}
          onClose={() => setEditPopup(undefined)}
          onUpdated={editPopup.onSuccess}
        />
      )}
    </Context.Provider>
  )
}
