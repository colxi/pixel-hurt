import { useEffect, useState, type FC } from 'react'
import Editor from '@monaco-editor/react'
import { defaultFileDefinitions, getFileDescriptor, initCodeEditor, pixelHurtFileDefinition } from './monacoEditor'
import { sleep, throwError } from '../../tools/utils'

import type { OnMount, OnChange, BeforeMount } from '@monaco-editor/react'
import type { MonacoEditor, MonacoEditorModel } from './CodeEditor.types'
import { CodeEditorContainer, EditorWrapper, ExecuteButton, FileButton } from './CodeEditor.styles'
import { useLocation } from 'react-router-dom'

initCodeEditor()


export const CodeEditor: FC = () => {
  const [editorInstance, setEditorInstance] = useState<MonacoEditor | null>(null)
  const [editorFileModels, setEditorFileModels] = useState<MonacoEditorModel[]>([])
  const [currentFileData, setCurrentFileData] = useState(getFileDescriptor('/file1.js'))

  const [isVisible, setIsVisible] = useState(false)
  const locations = useLocation()

  useEffect(() => {
    setIsVisible(locations.pathname === '/code')
  }, [locations])

  /**
   *
   * Apply formatting to the editor active document
   *
   */
  const formatCurrentDocument = () => {
    if (!editorInstance) throw new Error('[formatCurrentDocument]: Editor not initialised')
    console.log('Formatting current file')
    const action = editorInstance.getAction('editor.action.formatDocument')
    if (!action) throw new Error('[formatCurrentDocument]: Action "editor.action.formatDocument" not found')
    action.run().catch(throwError)
  }

  /**
   *
   * Performs validation on the requested file.
   * This is a HACK to force the editor to validate the file, by adding a space at the end of the file.
   * TODO: Find a better approach as this hack causes the history of the file to be lsot
   *
   */
  const validateFile = (file: string) => {
    if (!editorFileModels) throw new Error('[validateFile]: Modules not initialised')
    console.log(`Validating file: ${file}`)
    const model = editorFileModels.find((m) => m.uri.path === file)
    model?.setValue(model.getValue() + ' ')
  }

  /**
   *
   * Load the requested file into the editor.
   * Before loading the file, it validates it, and once loaded it formats the document.
   *
   */
  const loadFile = async (file: string) => {
    if (!editorInstance) throw new Error('[loadFile]: Editor not initialized')
    console.log(`Loading file: ${file}`)
    validateFile(file)

    setCurrentFileData(getFileDescriptor(file))
    editorInstance.focus()
    await sleep(50)
    formatCurrentDocument()
  }

  /**
   *
   *
   *
   */
  const configureGoToDefinitionService = () => {
    if (!editorInstance || !editorFileModels) return
    // This hack intercepts GoToDefinition (ZoneWidget) service calls
    // and provides compatibility for definitions that live on other models
    const editorService = (editorInstance as any)._codeEditorService
    if (!editorService) {
      console.log('Go to definition hack not available')
      return
    }
    const openEditorBase = editorService.openCodeEditor.bind(editorService)
    editorService.openCodeEditor = async (input: any, source: MonacoEditor) => {
      const result = await openEditorBase(input, source)
      // TODO: Ignore the request in case is not any of the user files
      await loadFile(input.resource.path)
      editorInstance.setSelection(input.options.selection)
      editorInstance.revealLine(input.options.selection.startLineNumber)
      return result
    }
  }

  /**
   *
   * Pack all the code of the game into a single file (string) and execute it
   *
   */
  const executeGame = () => {
    console.log('Running game')
    // eval(code)
  }


  const onEditorBeforeMount: BeforeMount = (monacoInstance) => {
    // Add PixelHurt definitions as library in order to enable typing
    monacoInstance.languages.typescript.javascriptDefaults.addExtraLib(
      pixelHurtFileDefinition.code,
      pixelHurtFileDefinition.path
    )
    // configure validation options
    monacoInstance.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      noSuggestionDiagnostics: false,
      onlyVisible: false
    })
    // configure compiler options
    monacoInstance.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monacoInstance.languages.typescript.ScriptTarget.ES2020,
      allowJs: true,
      checkJs: true,
      allowNonTsExtensions: true,
      isolatedModules: false
    })
    monacoInstance.editor.defineTheme('pixel-hurt', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        // { token: '', fontStyle: 'italic' },
        // { token: 'comment', foreground: 'ffa500', fontStyle: 'italic underline' },
        // { token: 'comment.js', foreground: '008800', fontStyle: 'bold' },
        // { token: 'comment.css', foreground: '0000ff' } // will inherit fontStyle from `comment` above
      ],
      colors: {
        // 'editor.foreground': '#000000'
      }
    })
    // Initialize file models
    setEditorFileModels([pixelHurtFileDefinition, ...defaultFileDefinitions].map((file) =>
      monacoInstance.editor.createModel(
        file.code,
        file.language,
        monacoInstance.Uri.parse(file.path)
      )))
  }

  /**
   *
   *
   *
   */
  const onEditorMounted: OnMount = (editor) => {
    setEditorInstance(editor)
    editorFileModels.forEach((model) => model.updateOptions({ tabSize: 2 }))
  }

  const onEditorReady = () => {
    if (!editorInstance) return
    const init = async () => {
      configureGoToDefinitionService()
      await loadFile('/file1.js')
    }
    init().catch(throwError)
  }

  const onEditorFileCodeChange: OnChange = (code) => {
    setCurrentFileData({ ...currentFileData, code: code ?? '' })
  }


  // useEffect(() => { console.log(editorFileModels) }, [editorFileModels])
  useEffect(onEditorReady, [editorInstance])

  return <div className="codeEditor">
    <CodeEditorContainer $isVisible={isVisible}>
      {
        editorFileModels
          .filter((file) => !file.uri.path.includes('.d.ts'))
          .map((file) => <FileButton key={file.uri.path} onClick={() => loadFile(file.uri.path)}>{file.uri.path}</FileButton>)
      }
      <FileButton>+</FileButton>
      <ExecuteButton onClick={executeGame}>Execute</ExecuteButton>
      <EditorWrapper>
        <Editor
          height="90vh"
          defaultLanguage={currentFileData.language}
          path={currentFileData.path}
          defaultValue={currentFileData.code}
          // [RESOURCE]: Create a theme : https://blog.expo.dev/building-a-code-editor-with-monaco-f84b3a06deaf
          theme="pixel-hurt"
          options={{
            autoIndent: 'full',
            formatOnPaste: true,
            formatOnType: true,
            contextmenu: false,
            fontSize: 30,
            lineHeight: 25,
            fontFamily: 'VT323',
            tabSize: 4,
            detectIndentation: false,
            tabCompletion: 'on',
            minimap: {
              enabled: false
            }
          }}
          onChange={onEditorFileCodeChange}
          onMount={onEditorMounted}
          beforeMount={onEditorBeforeMount}
        />
      </EditorWrapper>
    </CodeEditorContainer >
  </div>
}