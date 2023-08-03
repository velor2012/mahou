import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom/client'

// css
import 'modern-normalize/modern-normalize.css'
import './index.css'

// fonts
import './fonts/Noto_Sans_SC/style.scss'
import './fonts/SSFangTangTi/style.scss'

// dayjs
import dayOfYear from 'dayjs/plugin/dayOfYear'
import dayjs from 'dayjs'
dayjs.extend(dayOfYear)

import { ETemplate, TEMPLATE_INFO } from './constants'
import { DayNews } from './pages/DayNews'

if (process.env.NODE_ENV === 'development') {
  const tpl = ETemplate.dayNews
  window.renderTemplate = tpl
  // set body size
  setBodySize(...TEMPLATE_INFO[tpl].size)
}

const render = (tpl: ETemplate) => {
  const root = ReactDOM.createRoot(document.getElementById('root')!)

  const map: Record<ETemplate, ReactNode> = {
    [ETemplate.dayNews]: <DayNews />
  }

  root.render(
    <React.StrictMode>
      {map[tpl]}
    </React.StrictMode>
  )
}

render(window.renderTemplate)

function setBodySize(w: number, h: number) {
  const styleElm = document.createElement('style')
  const style = `
    body {
      width: ${w}px;
      height: ${h}px;
      outline: 1px solid orange;
    }
  `
  styleElm.innerHTML = style
  document.head.appendChild(styleElm)
}
