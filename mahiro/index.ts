import { IMahiroUse } from 'mahiro'
import { join } from 'path'
import nodeHtmlToImage from 'node-html-to-image'
import { existsSync, readFileSync, statSync } from 'fs'
import { getAllData } from './data'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const avaliableGroups = new Set<number>()

const pluginName = `mahou`
const htmlPath = join(__dirname, '../render/common/dist/index.html')

export const Mahou = () => {
  if (!existsSync(htmlPath)) {
    throw new Error(
      `render html not found, please run 'pnpm build' on monorepo root first`
    )
  }

  const mark2cron = {
    sun: '0 7 * * 0',
    mon: '0 7 * * 1',
    tue: '0 7 * * 2',
    wed: '0 7 * * 3',
    thu: '0 7 * * 4',
    fri: '0 7 * * 5',
    sat: '0 7 * * 6',
  }
  const bangumiPath = join(__dirname, './bangumi.json')
  if (!existsSync(bangumiPath)) {
    throw new Error(
      'bangumi.json not found, please run pnpm sync:bgm for generate'
    )
  }
  const bangumi = JSON.parse(readFileSync(bangumiPath, 'utf-8')) as Record<
    string,
    any
  >
  const outputPath = join(__dirname, './output.png')

  const use: IMahiroUse = async (mahiro) => {
    const logger = mahiro.logger.withTag(pluginName) as typeof mahiro.logger
    logger.info(`load ${pluginName} plugin ...`)

    const dayjs = mahiro.utils.dayjs
    const render = async (day: string) => {
      // if create time is today, use cache
      if (existsSync(outputPath)) {
        const stats = statSync(outputPath)
        const latestUpdateTimeIns = dayjs(stats.mtimeMs)
        const currentIns = dayjs()
        // 60 minutes
        if (currentIns.diff(latestUpdateTimeIns, 'minute') < 60) {
          logger.info(`${pluginName}: use output cache for ${day}`)
          return true
        }
      }

      logger.info(`${pluginName}: get all remote data`)
      const remoteData = await getAllData()
      logger.success(`${pluginName}: get all remote data success`)

      logger.info(`${pluginName}: render for ${day}`)

      const height = 2210
      const width = 780
      const buffer = await nodeHtmlToImage({
        html: readFileSync(htmlPath, 'utf-8')
          .replace('{{renderTemplate}}', JSON.stringify('dayNews'))
          .replace(
            '{{renderData}}',
            JSON.stringify({
              timestamp: dayjs().valueOf(),
              bilibiliHotTopic: remoteData.bili,
              currentDayNewBangumi: bangumi[day],
              techNews: remoteData.tech,
              gameNews: remoteData.game,
              hitokoto: remoteData.hitokoto,
            })
          )
          .replace('{{bodyHeight}}', `${height}`)
          .replace('{{bodyWidth}}', `${width}`),
        output: outputPath,
        timeout: 60 * 1e3,
        puppeteerArgs: {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          defaultViewport: {
            width,
            height,
            deviceScaleFactor: 2,
          },
        },
      })
      logger.info(`bangumi: render over for ${day}`)
      return buffer
    }

    const task = async (day: string, specifiedGroup?: number) => {
      // check group
      const willSendGroups = specifiedGroup
        ? [specifiedGroup]
        : Array.from(avaliableGroups)
      if (!willSendGroups.length) {
        logger.info(`${pluginName}: no group avaliable for ${day}`)
        return
      }

      try {
        const buffer = await render(day)
        if (!buffer || !existsSync(outputPath)) {
          logger.error(`${pluginName}: render failed for ${day}`)
          throw new Error('render failed')
        }

        // render success, send to groups
        logger.success(`${pluginName}: render success for ${day}`)
        // waterfull call
        for await (const groupId of willSendGroups) {
          // sleep 1s
          await sleep(1000)
          logger.info(`${pluginName}: send to ${groupId}`)
          await mahiro.sendGroupMessage({
            groupId,
            fastImage: outputPath,
          })
          logger.success(`${pluginName}: send success to ${groupId}`)
        }
      } catch (e) {
        logger.error(`${pluginName}: render failed for ${day}`, e)
      }
    }

    const pluginKey = pluginName
    mahiro.onGroupMessage(pluginKey, async ({ groupId, userId, msg }) => {
      avaliableGroups.add(groupId)

      // trigger immediately
      if (msg?.Content === '真寻日报') {
        logger.info(`${pluginName}: trigger for ${groupId}`)
        const mark = dayjs().format('ddd').toLowerCase()
        try {
          task(mark, groupId)
        } catch (e) {
          logger.error(`${pluginName}: run task failed for ${groupId}`, e)
        }
      }
    })

    Object.keys(mark2cron).forEach((day) => {
      // register cron
      logger.info(`${pluginName}: register cron job for ${day}`)
      const cron = (mark2cron as any)[day]
      mahiro.cron.registerCronJob(cron, async () => {
        logger.info(`${pluginName}: trigger cron job for ${day}`)
        try {
          task(day)
        } catch (e) {
          logger.error(`${pluginName}: run cron task failed for ${day}`, e)
        }
      })
    })
  }

  return use
}
