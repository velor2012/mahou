export interface IBilibiliHotTopic {
  icon?: string
  title: string
}

export interface IBangumi {
  title: string
  cover?: string
  error?: boolean
}

type ITech = string
type IGame = string
export const defaultImgUrl = 'data:image/png;base64,+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
export const dayNewsDataFallback: IDayNewsData = {
  title: '真寻日报',
  subTitle: 'ZhenXun NEWS',
  timestamp: Date.now(),
  bilibiliHotTopic: [],
  currentDayNewBangumi: [],
  techNews: [],
  gameNews: [],
  hitokoto: '愿你能与你重要的人再次相遇',
  base64Imgs: {
    fishIcon: defaultImgUrl,
    bilibiliIcon: defaultImgUrl,
    bgmIcon: defaultImgUrl,
    itIcon: defaultImgUrl,
    gameIcon: defaultImgUrl,
    hitokotoIcon: defaultImgUrl,
    mahiroLogo: defaultImgUrl,
    bottomFallback: defaultImgUrl,
    emptyFallback: defaultImgUrl
  }
}

export interface IDayNewsData {
  /**
   * 主标题
   * @example `真寻日报`
   */
  title?: string
  /**
   * 副标题
   * @example `MAHIRO NEWS`
   */
  subTitle?: string
  /**
   * 时间戳
   * @default {Date.now()}
   * @example 1610000000000
   */
  timestamp?: number
  /**
   * B站热点
   */
  bilibiliHotTopic: IBilibiliHotTopic[]
  /**
   * 今日新番
   */
  currentDayNewBangumi: IBangumi[]
  /**
   * 科技资讯
   */
  techNews: ITech[]
  /**
   * 游戏资讯
   */
  gameNews: IGame[]
  /**
   * 今日一言
   */
  hitokoto: string
  /**
   * base64图片
   */
  base64Imgs: IBase64Imgs
}

export interface IBase64Imgs {
    fishIcon: string,
    bilibiliIcon: string,
    bgmIcon: string,
    itIcon: string,
    gameIcon: string,
    hitokotoIcon: string,
    mahiroLogo: string,
    bottomFallback: string,
    emptyFallback: string
}

export interface IFishCalendar {
  toWeekendsDay: number
  toMidAutumnDay: number
  toNationalDay: number
  toNewYearDay: number
  toSpringDay: number
  toTombSweepingDay: number
  toLaborDay: number
  toDragonBoatDay: number
}
