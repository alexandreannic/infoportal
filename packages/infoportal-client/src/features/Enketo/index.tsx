import React, {useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import XForm, {PageInfo} from './xform'
import PageIndicator from './pageIndicator'
import {FormStatus, SubmissionValidation} from './types'
import ValidationOnNavigationModal from './modals/validationOnNavigationModal'
import ValidationOnSubmitModal from './modals/validationOnSubmitModal'
import {dummyForm} from '@/features/Enketo/dummy-form'
import {dummyModel} from '@/features/Enketo/dummy-model'

export const EnketoEditableForm2 = () => {
  return 'TeST'
}
export const EnketoEditableForm = () => {
  const [loading, setLoading] = useState(true)
  const xform = useRef<XForm | null>(null)

  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
  const [lastSavedData, setLastSavedData] = useState<string | null>(null)
  const [formTouched, setFormTouched] = useState(false)
  const [status, setStatus] = useState<FormStatus>({type: 'idle'})
  const [editable, setEditable] = useState(true)
  const [showValidationConfirmation, setShowValidationConfirmation] =
    useState(false)
  const [submissionValidation, setSubmissionValidation] =
    useState<SubmissionValidation>(null)
  const navigate = useNavigate()

  const isFormModified = !loading && xform !== null && formTouched

  useEffect(() => {
    console.log('111')
    const unMount = () => {
      if (xform.current) {
        xform.current.resetView()
      }
      // Clears enketo cache or something going on there which slows down
      // form re-init/getData.
      // navigate(0)
    }

    return () => {
      unMount()
    }
  }, [navigate])

  useEffect(() => {
    console.log('222')
    let isSubscribed = true // to cancel form initialization
    /**
     * Should the UI treat the assignment as editable?
     *
     * (The API will have editable as true if the user has edit access, but we
     * also want to prevent a user editing the form data if it's in a finalized
     * state, to prevent accidental changes)
     */
    const editable = true

    // Convert the ArrayBuffers to Blobs to use in the form
    // const files = currentFiles.map((f) => ({
    //   name: f.name,
    //   data: new Blob([new Uint8Array(f.data)]),
    // }))
    const _xform = new XForm(dummyForm, dummyModel, null, [], {
      onDataUpdate: ({xform}: any) => {
        setFormTouched(true)
      },
      onPageFlip: ({xform}: any) => {
        setPageInfo(xform.getPageInfo())
      },
    })
    const timer = setTimeout(() => {
      // Long-running process, it could take up to 20 seconds
      // depending on number of embedded locations/sublocations.
      _xform.init(editable).then(() => {
        if (isSubscribed) {
          // user has abandoned this page
          xform.current = _xform
          setEditable(editable)
          setLoading(false)
          setPageInfo(_xform.getPageInfo())
        }
      })
    })
    return () => {
      clearTimeout(timer)
      isSubscribed = false
      setLoading(false)
    }
  }, [])

  const handleNext = async () => {
    if (xform.current) {
      if (editable) {
        const valid = await xform.current.validateCurrentPage()
        if (valid) {
          xform.current.goToNextPage()
        } else {
          setShowValidationConfirmation(true)
        }
      } else {
        xform.current.goToNextPage()
      }
    }
    // Save form after advancing to the next page
    setTimeout(() => saveForm(), 0)
  }

  const forceNextPage = () => {
    if (xform.current) {
      xform.current.goToNextPage()
      setShowValidationConfirmation(false)
    }
  }

  const saveForm = async (redirect = false, finalized = false) => {
    return
    if (xform.current && (formTouched || finalized)) {
      // If the user is trying to finalize (submit) the form
      // Ensure the entire form is valid
      if (finalized) {
        // Display a validating indicator before enketo freezes the browser
        setSubmissionValidation('in-progress')
        // Give the browser some time to render this state change
        await new Promise((resolve) => setTimeout(resolve, 10))

        const valid = await xform.current!.validateEverything()
        if (!valid) {
          // If the form is invalid, we don't want to submit it
          // But we can still save it.
          saveForm()
          setSubmissionValidation('invalid')
          return
        } else {
          setSubmissionValidation(null)
        }
      }

      setStatus({type: 'saving'})
      setTimeout(async () => {
        if (!xform.current) {
          return
        }

        const t0 = performance.now()
        const {data, files} = xform.current.getData()
        const t1 = performance.now()
        console.log('getData time: ' + (t1 - t0) + 'ms')

        if (lastSavedData !== data || finalized) {
          // const {
          //   task: {form},
          // } = assignment

          // // Convert each file Blob to an ArrayBuffer
          // const convertedFiles = await Promise.all(
          //   files.map(async (f) => ({
          //     name: f.name,
          //     data: await f.data.arrayBuffer(),
          //   }))
          // )

          // return env.dummy-model.ts.reportingWindows
          //   .updateAssignment({
          //     assignmentId: assignment.id,
          //     previousVersion: assignment.version,
          //     form: {
          //       id: form.id,
          //       version: form.version,
          //       data,
          //       files: convertedFiles,
          //       finalized,
          //     },
          //   })
          //   .then((assignment) => {
          //     setLastSavedData(assignment.task.currentData)
          //     setUpdatedAssignment(assignment)
          //     setFormTouched(false)
          //     setStatus({type: 'idle'})
          //     const msg = t.t(
          //       lang,
          //       (s) => s.routes.operations.forms.status.idle
          //     )
          //     toast.success(msg, {position: toast.POSITION.TOP_RIGHT})
          //     if (redirect) {
          //       if (finalized) {
          //         alert(
          //           t.t(lang, (s) => s.routes.operations.forms.prompts.finished)
          //         )
          //       } else {
          //         alert(
          //           t.t(
          //             lang,
          //             (s) =>
          //               s.routes.operations.forms.prompts.submissionRequired
          //           )
          //         )
          //       }
          //       navigate(-1)
          //     }
          //   })
          //   .catch((err) => {
          //     if (errors.isConflictError(err)) {
          //       const timeAgo = dayjs(err.timestamp).locale(lang)
          //       alert(
          //         t
          //           .t(lang, (s) => s.routes.operations.forms.errors.conflict)
          //           .replace('{timeAgo}', timeAgo.fromNow())
          //           .replace('{person}', err.otherUser)
          //       )
          //       setStatus({
          //         type: 'conflict',
          //         timestamp: err.timestamp,
          //         otherPerson: err.otherUser,
          //       })
          //       const msg = t
          //         .t(lang, (s) => s.routes.operations.forms.errors.conflict)
          //         .replace('{timeAgo}', timeAgo.fromNow())
          //         .replace('{person}', err.otherUser)
          //     } else {
          //       setStatus({
          //         type: 'error',
          //         message: err.message || err.toString(),
          //       })
          //       const msg = t.t(
          //         lang,
          //         (s) => s.routes.operations.forms.status.error
          //       )
          //     }
          //   })
        }
      })
    } else if (redirect) {
      navigate(-1)
    }
  }

  /**
   * Ensure that all link clicks open in a new tab
   */
  const captureLinkClicks = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target instanceof HTMLAnchorElement && e.target.href) {
      e.target.target = '_blank'
      e.target.rel = 'noopener noreferrer'
    }
  }

  return (
    <div>
      {loading && (
        <div>
          Loading...
        </div>
      )}
      <div className="enketo" id="form" onClick={captureLinkClicks}>
        <form></form>
        <PageIndicator pageInfo={pageInfo}/>
        <div className="main" style={{display: loading ? 'none' : 'block'}}>
          <div className="container pages"></div>
          <section className="form-footer end">
            <div className="form-footer__content">
              <PageIndicator pageInfo={pageInfo}/>
              <div className="form-footer__content__main-controls">
                <button className="btn btn-default previous-page disabled">
                  Prev
                </button>
                {editable && (
                  <button
                    onClick={() => saveForm()}
                  >
                    Save
                  </button>
                )}
                {editable && pageInfo?.isLastPage && (
                  <button
                    onClick={() => saveForm(true)}
                    className="btn btn-default"
                    style={{display: 'inline-block'}}
                  >
                    saveAndClose
                  </button>
                )}
                {!pageInfo?.isLastPage && (
                  <button onClick={handleNext} className="btn btn-primary">
                    next
                  </button>
                )}
                {editable && pageInfo?.isLastPage && (
                  <button>
                    SubmitButton
                  </button>
                )}
              </div>
            </div>
            <ValidationOnNavigationModal
              nextPage={forceNextPage}
              showValidationConfirmation={showValidationConfirmation}
              closeValidationMessage={() =>
                setShowValidationConfirmation(false)
              }
            />
            <ValidationOnSubmitModal
              submissionValidation={submissionValidation}
              closeInvalidSubmissionMessage={() =>
                setSubmissionValidation(null)
              }
            />
          </section>
        </div>
      </div>
    </div>
  )
}
