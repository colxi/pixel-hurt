import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import { finByIndex, throwError } from '../../tools/utils'

/**
 *
 *
 *
 *
 */
export const initCodeEditor = () => {
  console.log('Initializing CodeEditor (Monaco)')

  // Init workers
  window.MonacoEnvironment = {
    getWorker(_, label) {
      if (label === 'typescript' || label === 'javascript') return new tsWorker()
      return new editorWorker()
    }
  }
  loader.config({ monaco })
  loader.init().catch(throwError)

  // Inbject PixelHurt library on window object
  ;(window as any).PixelHurt = {
    sprite: function () {
      console.log('sprite')
    }
  }
}

/**
 *
 *
 *
 */
export function getFileDescriptor(file: string) {
  const entry = finByIndex([pixelHurtFileDefinition, ...defaultFileDefinitions], 'path', file)
  if (!entry) throw new Error(`[getFileDescriptor]: File descriptor not found: ${file}`)
  return entry
}

export const PixelHurtTypescriptDefinitionsCode = `
    declare class PixelHurt {
        static sprite(id:number): void
    }
`

export const pixelHurtFileDefinition = {
  enumerable: false,
  path: '/pixelHurt.d.ts',
  language: 'typescript',
  code: PixelHurtTypescriptDefinitionsCode
}

export const defaultFileDefinitions = [
  {
    enumerable: true,
    path: '/file1.js',
    language: 'javascript',
    code: `
        // file 1
        PixelHurt.sprite('1')
        potato = 121

        function asd() {
            return
        }  
    `
  },
  {
    enumerable: true,
    path: '/file2.js',
    language: 'javascript',
    code: `
        // file 2
        const potato = 123
    `
  },
  {
    enumerable: true,
    path: '/file3.js',
    language: 'javascript',
    code: `
        // file 3
    `
  }
]
