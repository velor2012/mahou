import { XMLParser } from 'fast-xml-parser'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'fs'
import { join } from 'path'
import dayjs from 'dayjs'
type Item = {
    title: string
    icon: string 
    show_name: string
}
const ensureCacheDir = () => {
  const cacheDir = join(__dirname, './cache')
  console.log(cacheDir)
  if (existsSync(cacheDir)) {
      console.log('cacheDir exist')
    return
  }
  console.log('mkdirSync', cacheDir)
  mkdirSync(cacheDir)
}
ensureCacheDir()

export const getTechData = async () => {
  const cacheFile = join(__dirname, './cache/tech.xml')
  let text: string | undefined
  if (existsSync(cacheFile)) {
    // check cache valid
    const latestUpdateTime = statSync(cacheFile).mtimeMs
    // 60 Minutes
    const validTimeGap = 60 * 60 * 1000
    const currentTime = dayjs().valueOf()
    if (currentTime - latestUpdateTime < validTimeGap) {
      console.log(`mahou: use tech cache`)
      text = readFileSync(cacheFile, 'utf-8')
    }
  }
  if (!text?.length) {
    console.log(`mahou: tech cache expired, fetch new data`)
    const res = await fetch(`https://www.ithome.com/rss/`)
    text = await res.text()
    // write
    writeFileSync(cacheFile, text, 'utf-8')
  }
  const parser = new XMLParser()
  const xml = parser.parse(text)
  const list = xml?.rss?.channel?.item || []
  const info = list.map((i: Item) => i?.title).filter(Boolean) as string[]
  return info
}

export const getGameData = async () => {
  const cacheFile = join(__dirname, './cache/game.xml')
  let text: string | undefined
  if (existsSync(cacheFile)) {
    // check cache valid
    const latestUpdateTime = statSync(cacheFile).mtimeMs
    const latestUpdateIns = dayjs(latestUpdateTime)
    const currentIns = dayjs()
    // same day
    const dayGap = currentIns.diff(latestUpdateIns, 'day')
    if (dayGap < 1) {
      console.log(`mahou: use game cache`)
      text = readFileSync(cacheFile, 'utf-8')
    }
  }
  if (!text?.length) {
    console.log(`mahou: game cache expired, fetch new data`)
    const res = await fetch(`https://www.4gamers.com.tw/rss/latest-news`)
    text = await res.text()
    // write
    writeFileSync(cacheFile, text, 'utf-8')
  }
  const parser = new XMLParser()
  const xml = parser.parse(text)
  const list = xml?.rss?.channel?.item || []
  const info = list.map((i: Item) => i?.title).filter(Boolean) as string[]
  return info
}

export const getBiliData = async () => {
  const cacheFile = join(__dirname, './cache/bili.json')
  let text: string | undefined
  if (existsSync(cacheFile)) {
    // check cache valid
    const latestUpdateTime = statSync(cacheFile).mtimeMs
    // 60 Minutes
    const validTimeGap = 60 * 60 * 1000
    const currentTime = dayjs().valueOf()
    if (currentTime - latestUpdateTime < validTimeGap) {
      console.log(`mahou: use bili cache`)
      text = readFileSync(cacheFile, 'utf-8')
    }
  }
  if (!text?.length) {
    console.log(`mahou: bili cache expired, fetch new data`)
    const res = await fetch(`https://s.search.bilibili.com/main/hotword`)
    text = await res.text()
    // write
    writeFileSync(cacheFile, text, 'utf-8')
  }
  const json = JSON.parse(text)
  const info = (json?.list || [])
    ?.map((i: Item) => {
      return {
        icon: i?.icon,
        title: i?.show_name,
      }
    })
    ?.filter((i: Item) => i?.title?.length)
  return info || []
}

export const getHitokotoData = async () => {
  const cacheFile = join(__dirname, './cache/hitokoto.json')
  let text: string | undefined
  if (existsSync(cacheFile)) {
    // check cache valid
    const latestUpdateTime = statSync(cacheFile).mtimeMs
    // 12 hours
    const validTimeGap = 12 * 60 * 60 * 1000
    const currentTime = dayjs().valueOf()
    if (currentTime - latestUpdateTime < validTimeGap) {
      console.log(`mahou: use hitokoto cache`)
      text = readFileSync(cacheFile, 'utf-8')
    }
  }
  if (!text?.length) {
    console.log(`mahou: hitokoto cache expired, fetch new data`)
    const res = await fetch(`https://v1.hitokoto.cn/?c=a`)
    text = await res.text()
    // write
    writeFileSync(cacheFile, text, 'utf-8')
  }
  const json = JSON.parse(text)
  const info = json?.hitokoto
  return info as string | undefined
}

export const getAllData = async () => {
  // try parrallel fetch
  const tasks = [
    // tech
    async () => {
      try {
        const tech = await getTechData()
        return tech || []
      } catch (e) {
        console.log(`mahou: fetch tech data failed`, e)
        return []
      }
    },
    // game
    async () => {
      try {
        const game = await getGameData()
        return game || []
      } catch (e) {
        console.log(`mahou: fetch game data failed`, e)
        return []
      }
    },
    // bili
    async () => {
      try {
        const bili = await getBiliData()
        return bili || []
      } catch (e) {
        console.log(`mahou: fetch bili data failed`, e)
        return []
      }
    },
    // hitokoto
    async () => {
      try {
        const hitokoto = await getHitokotoData()
        return hitokoto
      } catch (e) {
        console.log(`mahou: fetch hitokoto data failed`, e)
        return undefined
      }
    },
  ]
  try {
    const [tech, game, bili, hitokoto] = await Promise.all(
      tasks.map((t) => t())
    )
    return {
      tech,
      game,
      bili,
      hitokoto,
    }
  } catch (e) {
    console.log(`mahou: fetch all data failed`, e)
    return {
      tech: [],
      game: [],
      bili: [],
      hitokoto: undefined,
    }
  }
}
