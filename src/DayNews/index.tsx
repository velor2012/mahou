"use client"; // This is a client component
import styles from './index.module.scss'
// import mahiroLogo from './assets/1.no-bg.png'
import Image, { StaticImageData } from "next/image";
import { CSSProperties, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import {
  IBangumi,
  IBilibiliHotTopic,
  IDayNewsData,
  IFishCalendar,
  dayNewsDataFallback,
  defaultImgUrl,
} from './interface'
import dayjs, { type Dayjs } from 'dayjs'
import calendar from '@/utils/js-calendar-converter'
// import fishIcon from './assets/icons/fish.png'
// import bilibiliIcon from './assets/icons/bilibili.png'
// import bgmIcon from './assets/icons/bgm.png'
// import itIcon from './assets/icons/it.png'
// import gameIcon from './assets/icons/game.png'
// import hitokotoIcon from './assets/icons/hitokoto.png'
import { sortBy } from 'lodash'
import cx from 'clsx'
import React from 'react'
import bgmCoverFallback from './assets/2.png'
import { ensureFreeHdslb } from '@/utils/hdslb'
import st from '@/utils/chinese_s2t'
// import bottomFallback from './assets/bottom.png'
// import emptyFallback from './assets/2.no-bg.png'

// mock
// import biliData from './mock/hotTopic.json'
// import bgmData from './mock/bgm.json'
// import techData from './mock/tech.json'
// import gameData from './mock/game.json'

export const DayNews = () => {
  const [data, setData] = useState<IDayNewsData>(dayNewsDataFallback)
  const fetchData = async ()=>{
    const response = await fetch('/api/getData', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    const t = (await response.json()) as IDayNewsData
    return t
  }
  const saveImg = async ()=>{
    const response = await fetch('/api/saveImg', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    const t = (await response.json()) as IDayNewsData
    return t
  }

  useEffect(() => { 
    fetchData().then((res) => { 
        setData(res)
        
    })
  }, [])
  
  const sendHtml = async ()=>{
    const response = await fetch('/api/saveHtml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           html: document.documentElement.outerHTML
        })
      });
    const t = (await response.json()) as IDayNewsData
    return t
  }

//   useEffect(() => { 
//     setTimeout(()=>{
//         // sendHtml()
//         // saveImg()
//     }, 3000)
//   }, [])

  const timestamp = data.timestamp || dayNewsDataFallback.timestamp!
  const dayIns = dayjs(timestamp)
  const week = getWeekDay(dayIns)
  const dayLabel = getDayLabel(dayIns)
  const lunarLabel = getLunarLabel(dayIns)

  // fish
  const fishCalendar = getFishCalendar(dayIns)

  // bili
  const biliData = data.bilibiliHotTopic?.length
    ? data.bilibiliHotTopic
    : dayNewsDataFallback.bilibiliHotTopic
  // max 10
  const biliContent = getBili(biliData.slice(0, 10))

  // bgm
  const bgmData = data.currentDayNewBangumi?.length
    ? data.currentDayNewBangumi
    : dayNewsDataFallback.currentDayNewBangumi
  // max 10
  const bgmContent = getBgm(bgmData.slice(0, 10))

  // tech
  const techData = data.techNews?.length ? data.techNews : dayNewsDataFallback.techNews
  // max 10
  const techContent = getCommonList(techData.slice(0, 10), data.base64Imgs.emptyFallback)

  // game
  const gameData = data.gameNews?.length ? data.gameNews : dayNewsDataFallback.gameNews
  // max 10
  const gameContent = getCommonList(gameData.slice(0, 10),  data.base64Imgs.emptyFallback, true)

  // hitokoto
  const hitokotoData = data.hitokoto || dayNewsDataFallback.hitokoto
  const hitokotoContent = getHitokoto(hitokotoData)

  // bottom
  const onlyOneLineBgm = bgmData.length <= 5

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper_inner}>
        <div className={styles.header}>
          <div className={styles.header_left}>
            <Image 
            width={1} height={1} 
            src={data.base64Imgs.mahiroLogo}
            alt="Logo"
            priority
             />
          </div>
          <div className={styles.header_center}>
            <div className={styles.header_center_title}>
              {data.title || dayNewsDataFallback.title}
            </div>
            <div className={styles.header_center_sub_title}>
              {data.subTitle || dayNewsDataFallback.subTitle}
            </div>
          </div>
          <div className={styles.header_right}>
            <div className={styles.header_right_box}>
              <div className={styles.header_right_box_week}>{week}</div>
              <div className={styles.header_right_box_day}>{dayLabel}</div>
              <div className={styles.header_right_box_lunar}>{lunarLabel}</div>
            </div>
          </div>
        </div>
        <div className={styles.f}>
          <Block
            isCenter
            text="摸鱼日历"
            icon={data.base64Imgs.fishIcon}
            content={fishCalendar}
          />
          <Block
            isCenter
            text="B站热点"
            style={{
              marginLeft: 26,
              width: '100%',
              minWidth: 0,
            }}
            icon={data.base64Imgs.bilibiliIcon}
            content={biliContent}
          />
        </div>
        <div className={styles.s}>
          <Block text="今日新番" icon={data.base64Imgs.bgmIcon} content={bgmContent} />
        </div>
        <div className={styles.t}>
          <Block text="科技资讯" icon={data.base64Imgs.itIcon} content={techContent} />
        </div>
        <div className={styles.t}>
          <Block text="游戏资讯" icon={data.base64Imgs.gameIcon} content={gameContent} />
        </div>
        <div className={styles.four}>
          <Block
            text="今日一言"
            icon={data.base64Imgs.hitokotoIcon}
            content={hitokotoContent}
          />
        </div>
      </div>
      {onlyOneLineBgm && (
        <div className={styles.bottom}>
          <Image width={1} height={1}  src={data.base64Imgs.bottomFallback} alt='none'/>
        </div>
      )}
    </div>
  )
}

function getHitokoto(data: string) {
  return (
    <div className={styles.hitokoto}>
      <div className={styles.hitokoto_text}>{`“ ${data} ”`}</div>
    </div>
  )
}

function Empty({data = defaultImgUrl}) {
    
  return (
    <div className={styles.empty}>
      <Image width={1} height={1}  src={data} alt="empty" />
      <div className={styles.empty_text}>EMPTY</div>
    </div>
  )
}

function getCommonList(data: string[] = [], emptyImg: string, needT2S: boolean = false) {
  if (!data?.length) {
    return <Empty data={emptyImg}/>
  }

  return (
    <div className={styles.list}>
      {data.map((i) => {
        if (needT2S) {
          try {
            i = st.t2s(i)
          } catch {}
        }
        return (
          <div className={styles.list_line} key={i}>
            {`· ${i}`}
          </div>
        )
      })}
    </div>
  )
}

function getBgm(bgmData: IBangumi[] = []) {
  if (!bgmData?.length) {
    return <Empty />
  }

  const onlyOneLine = bgmData.length <= 5

  return (
    <div className={cx(styles.bgm, onlyOneLine && styles.bgm_one_line)}>
      {bgmData.map((i) => {
        const key = i.title
        if(i.error == undefined || i.error == null) i.error = false
        return (
          <div className={styles.bgm_item} key={key}>
            <div className={styles.bgm_item_cover}>
              {!i.error && <SafeImage src={i.cover!} onError={() => i.error = true} alt="bgm" />}
              {i.error && <Image width={1} height={1}  src={bgmCoverFallback} alt="bgm" />}
            </div>
            <div className={styles.bgm_item_title}>{i.title}</div>
          </div>
        )
      })}
    </div>
  )
}

function getBili(biliData: IBilibiliHotTopic[] = []) {
  if (!biliData?.length) {
    return <Empty />
  }

  const hasLive = biliData.some((i) => i?.icon?.length && i.icon.endsWith('.gif'))

  return (
    <div className={styles.bili}>
      {biliData.map((i) => {
        const key = i.title
        const url = i?.icon?.length ? ensureFreeHdslb(i.icon) : null
        return (
          <div key={key} className={styles.bili_line}>
            <div className={cx(styles.bili_icon, hasLive && styles.bili_icon_live)}>
              {url ? <SafeImage src={url} /> : null}
            </div>
            <div className={styles.bili_text}>{i.title}</div>
          </div>
        )
      })}
    </div>
  )
}

function getFishCalendar(ins: Dayjs) {
  const getUntilNextWeenkends = () => {
    const day = ins.day()
    if (day === 0 || day === 6) {
      return 0
    }
    return 6 - day
  }
  const getUntilNextLunarDay = (lunarDay: [number, number]) => {
    const year = ins.year()
    // @ts-expect-error
    const currentDay = calendar.lunar2solar(year, ...lunarDay)?.date
    if (!currentDay?.length) {
      return -1
    }
    const currentDayIns = dayjs(currentDay)
    const diff = currentDayIns.diff(ins, 'day')
    if (diff >= 0) {
      return diff
    }
    // @ts-expect-error
    const nextDay = calendar.lunar2solar(year + 1, ...lunarDay)?.date
    if (!nextDay?.length) {
      return -1
    }
    const nextDayIns = dayjs(nextDay)
    return nextDayIns.diff(ins, 'day')
  }
  const getUntilNextSolarDay = (solarDay: [number, number]) => {
    const year = ins.year()
    const solarDayLabel = `${solarDay[0]}-${solarDay[1]}`
    const currentDayIns = dayjs(`${year}-${solarDayLabel}`)
    const diff = currentDayIns.diff(ins, 'day')
    if (diff >= 0) {
      return diff
    }
    const nextDayIns = dayjs(`${year + 1}-${solarDayLabel}`)
    return nextDayIns.diff(ins, 'day')
  }
  const getUntilNextMidAutumn = () => {
    return getUntilNextLunarDay([8, 15])
  }
  const getUntilNextNational = () => {
    return getUntilNextSolarDay([10, 1])
  }
  const getUntilNextNewYear = () => {
    return getUntilNextSolarDay([1, 1])
  }
  const getUntilNextSpring = () => {
    return getUntilNextLunarDay([1, 1])
  }
  const getUntilNextTombSweeping = () => {
    return getUntilNextLunarDay([2, 5])
  }
  const getUntilNextLabor = () => {
    return getUntilNextSolarDay([5, 1])
  }
  const getUntilNextDragonBoat = () => {
    return getUntilNextLunarDay([5, 5])
  }
  const result: IFishCalendar = {
    toWeekendsDay: getUntilNextWeenkends(),
    toMidAutumnDay: getUntilNextMidAutumn(),
    toNationalDay: getUntilNextNational(),
    toNewYearDay: getUntilNextNewYear(),
    toSpringDay: getUntilNextSpring(),
    toTombSweepingDay: getUntilNextTombSweeping(),
    toLaborDay: getUntilNextLabor(),
    toDragonBoatDay: getUntilNextDragonBoat(),
  }
  const getLine = (text: string, day: number, idx: number=-1) => {
    return (
      <div className={styles.fish_line} key={idx}>
        <div className={styles.fish_line_label}>{`距离`}</div>
        <div className={styles.fish_line_highlight}>{text}</div>
        <div className={styles.fish_line_label}>{`还剩`}</div>
        <div className={styles.fish_line_day}>{day}</div>
        <div className={styles.fish_line_label}>{`天`}</div>
      </div>
    )
  }
  const labelMap: Record<keyof IFishCalendar, string> = {
    toWeekendsDay: '周末',
    toMidAutumnDay: '中秋节',
    toNationalDay: '国庆节',
    toNewYearDay: '元旦',
    toSpringDay: '春节',
    toTombSweepingDay: '清明节',
    toLaborDay: '劳动节',
    toDragonBoatDay: '端午节',
  }
  const sortedLines: ReactNode[] = []
  sortBy(
    Object.entries(result).filter((i) => i[0] !== 'toWeekendsDay'),
    (i) => i[1]
  ).forEach((i, idx) => {
    sortedLines.push(getLine(labelMap[i[0] as keyof IFishCalendar], i[1], idx))
  })
  return (
    <div className={styles.fish}>
      {getLine('周末', result.toWeekendsDay)}
      {sortedLines}
    </div>
  )
}

function Block({
  text,
  icon,
  content,
  style,
  isCenter = false,
}: {
  text: string
  icon: string | StaticImageData
  content: ReactNode
  style?: CSSProperties
  isCenter?: boolean
}) {
  return (
    <div className={styles.block} style={style}>
      <div
        className={cx(
          styles.block_title,
          isCenter && styles.block_title_center
        )}
      >
        <div className={styles.block_title_icon}>
          <Image width={1} height={1}  src={icon} alt="icon"/>
        </div>
        <div className={styles.block_title_text}>{text}</div>
      </div>
      <div className={styles.block_content}>{content}</div>
    </div>
  )
}

function getWeekDay(ins: Dayjs) {
  const d = ins.day()
  const map: Record<number, string> = {
    0: '日',
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
  }
  return map[d]
}

function getDayLabel(ins: Dayjs) {
  const label = ins.format('YYYY年MM月DD日')
  return label
}

function getLunarLabel(ins: Dayjs) {
  const year = ins.format('YYYY')
  const month = ins.format('MM')
  const day = ins.format('DD')
  try {
    const lunarInfo = calendar.solar2lunar(
      Number(year),
      Number(month),
      Number(day)
    )
    // @ts-expect-error
    if (!lunarInfo?.IMonthCn?.length || !lunarInfo.IDayCn?.length) {
      return `未知`
    }
    // @ts-expect-error
    return `${lunarInfo.IMonthCn}${lunarInfo.IDayCn}`
  } catch {
    return `未知`
  }
}

type ImageProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>

interface ISafeImageProps extends ImageProps {
  fallback?: string
}

function SafeImage({ fallback, ...props }: ISafeImageProps) {
  const [isError, setIsError] = useState(false)

  if (isError && !fallback?.length) {
    return null
  }

  return (
    <img
      {...props}
      onError={() => {
        setIsError(true)
      }}
      src={isError ? fallback : props.src}
    />
  )
}
