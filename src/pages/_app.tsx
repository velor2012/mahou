import "@/styles/globals.css";
import type { AppProps } from "next/app";

// css
import 'modern-normalize/modern-normalize.css'
import './index.css'

// fonts
import '@/fonts/Noto_Sans_SC/style.scss'
import '@/fonts/SSFangTangTi/style.scss'

// dayjs
import dayOfYear from 'dayjs/plugin/dayOfYear'
import dayjs from 'dayjs'
dayjs.extend(dayOfYear)

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
