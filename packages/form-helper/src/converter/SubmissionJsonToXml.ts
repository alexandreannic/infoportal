import {XMLBuilder} from 'fast-xml-parser'
import {Api} from '@infoportal/api-sdk'

type QIndex = Record<string, {$xpath: string; type: string} | undefined>

export const TO_FILL_LATER = '_TO_FILL_LATER_'

export class SubmissionJsonToXml {
  constructor(
    private formId: Api.FormId,
    private questionIndex: QIndex,
  ) {}

  readonly convert = (submission: Api.Submission): string => {
    const root: any = {}

    for (const [key, value] of Object.entries(submission.answers)) {
      const q = this.questionIndex[key]
      if (!q) continue

      const parts = q.$xpath.split('/').filter(Boolean)
      const leaf = parts.pop()! // last part is the question name

      this.assignNested(root, parts, leaf, value)
    }

    const builder = new XMLBuilder({
      ignoreAttributes: false,
      format: true,
    })

    // Kobo root is always "data"
    return builder.build({
      data: {
        '@_id': this.formId,
        ...(root.data ?? root),
      },
    })
  }

  private assignNested(obj: any, groupParts: string[], leaf: string, value: any) {
    let pointer = obj

    for (const part of groupParts) {
      pointer = pointer[part] ??= {}
    }

    if (Array.isArray(value)) {
      // Repeat group
      pointer[leaf] = value.map(v => this.convertRepeatBlock(v))
    } else {
      pointer[leaf] = value
    }
  }

  private convertRepeatBlock(block: any) {
    const out: any = {}

    for (const [k, v] of Object.entries(block)) {
      const q = this.questionIndex[k]
      if (!q) continue

      const parts = q.$xpath.split('/').filter(Boolean)
      const leaf = parts.pop()!

      out[leaf] = v
    }

    return out
  }
}
