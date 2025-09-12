import {Box, Icon, Tab, Tabs, useTheme} from '@mui/material'
import {useI18n} from '@/core/i18n/index.js'
import {useEffect, useMemo, useRef, useState} from 'react'
import * as monaco from 'monaco-editor'
import {Obj} from '@axanc/ts-utils'
import Editor from '@monaco-editor/react'
// @ts-ignore
import {constrainedEditor} from 'constrained-editor-plugin'
import {Core} from '@/shared/index.js'

const monacoBg = '#1e1e1e'

export function FormActionEditor({
  body = getDefaultBody(),
  saving,
  onSave,
  inputType,
  outputType,
}: {
  saving?: boolean
  onSave: (_: string) => void
  body?: string
  inputType: string
  outputType: string
}) {
  const t = useTheme()
  const {m} = useI18n()

  const files = useMemo(() => {
    return {
      '/action.ts': {
        value: body,
        isReadonly: false,
      },
      '/input.ts': {
        isReadonly: true,
        value: inputType,
      },
      '/output.ts': {
        isReadonly: true,
        value: outputType,
      },
      '/meta.ts': {
        isReadonly: true,
        value: getMetaInterface(),
      },
    } as const
  }, [body, inputType, outputType])

  const [activePath, setActivePath] = useState<keyof typeof files>('/action.ts')

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const monacoRef = useRef<typeof monaco | null>(null)

  const [bodyChanges, setBodyChanges] = useState<string>(body)

  useCaptureCtrlS(() => onSave(bodyChanges))

  useEffect(() => {
    setBodyChanges(body)
  }, [body])

  let restrictions: any[] = []

  useEffect(() => {
    const editor = editorRef.current
    const mon = monacoRef.current
    if (!editor || !mon) return

    const uri = mon.Uri.file(activePath)
    const model = mon.editor.getModel(uri)
    if (!model) return

    editor.updateOptions({readOnly: false})
    editor.setModel(model)
    editor
      .getAction('editor.action.formatDocument')
      ?.run()
      .then(() => {
        editor.updateOptions({readOnly: files[activePath].isReadonly})
      })
  }, [activePath])

  return (
    <Box sx={{borderRadius: t.vars.shape.borderRadius, overflow: 'hidden', background: monacoBg}}>
      {/*<Core.Btn variant="outlined">{m.save}</Core.Btn>*/}
      <Tabs value={activePath} onChange={(e, _) => setActivePath(_)} sx={{background: 'none', mb: 0.5}}>
        {Obj.keys(files).map(_ => (
          <Tab
            sx={{color: 'white'}}
            label={
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                {files[_].isReadonly && (
                  <Icon fontSize="small" sx={{mr: 1}}>
                    lock
                  </Icon>
                )}
                {_.replace(/^\//, '')}
              </Box>
            }
            value={_}
            key={_}
          />
        ))}
        <Core.Btn
          loading={saving}
          onClick={() => onSave(bodyChanges)}
          disabled={bodyChanges === body}
          variant="contained"
          size="small"
          sx={{alignSelf: 'center', marginLeft: 'auto', mr: 1}}
        >
          {m.save}
        </Core.Btn>
      </Tabs>
      <Editor
        options={{
          minimap: {enabled: false},
        }}
        onChange={_ => {
          if (activePath === '/action.ts') {
            setBodyChanges(_!)
          }
        }}
        onMount={(editor, monaco) => {
          editorRef.current = editor
          monacoRef.current = monaco

          Obj.entries(files).forEach(([path, {value, isReadonly}]) => {
            let model = monaco.editor.getModel(monaco.Uri.file(path))
            if (!model) monaco.editor.createModel(value, 'typescript', monaco.Uri.file(path))
            monaco.languages.typescript.typescriptDefaults.addExtraLib(
              value,
              `file://${path}`, // keep the .ts extension here
            )
          })
          editor.setModel(monaco.editor.getModel(monaco.Uri.file(activePath)))
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            onSave(bodyChanges)
          })
          // Readonly 1st row of action.ts
          const model = editor.getModel()!
          const constrainedInstance = constrainedEditor(monaco)
          constrainedInstance.initializeIn(editor)
          restrictions.push({
            range: [6, 1, model.getLineCount(), model.getLineMaxColumn(model.getLineCount())],
          })
          constrainedInstance.addRestrictionsTo(model, restrictions)
        }}
        beforeMount={(monacoInstance: typeof monaco) => {
          monacoInstance.languages.typescript.typescriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES2020,
            strict: true,
            noEmit: true,
            allowNonTsExtensions: true,
          })
        }}
        height="80vh"
        theme="vs-dark"
        defaultLanguage="typescript"
      />
    </Box>
  )
}

function getMetaInterface() {
  return `// Meta Data
    export type Submission<T extends Record<string, any>> = {
      id: string
      submissionTime: Date
      submittedBy: string
      answers: T
      start?: Date
      end?: Date
      version: string
      formId: string
      validationStatus: 'Approved' | 'Pending' | 'Rejected' | 'Flagged' | 'UnderReview' 
      attachments: {
        download_url: string;
        filename: string;
        download_small_url: string;
        question_xpath: string;
        id: number,;
      }[],
    }
  `
}

function getDefaultBody() {
  return [
    `import {Input} from 'input'`,
    `import {Output} from 'output'`,
    `import {Submission} from 'meta'`,
    ``,
    `async function transform(submission: Submission<Input.Type>): Promise<Output.Type | Output.Type[]> {`,
    `  // write your transformation here`,
    `  return submission`,
    `}`,
  ].join('\n')
}

function useCaptureCtrlS(action: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        action()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}
