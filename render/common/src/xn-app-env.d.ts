/// <reference types="@xn-sakina/meta/types/env" />

import { ETemplate } from './constants'

declare global {
  interface Window {
    renderTemplate: ETemplate
    renderData: Record<string, any>
  }
  declare module '*.ttf' {
    const src: string
    export default src
  }
}

export {}
