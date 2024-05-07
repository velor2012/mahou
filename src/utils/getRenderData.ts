import { IDayNewsData, dayNewsDataFallback } from '@/DayNews/interface'
import bangumi from '@/data/bangumi.json'
import { getAllData } from './data';
import dayjs from 'dayjs';

import {
    existsSync,
    mkdirSync,
    readFileSync,
    statSync,
    writeFileSync,
  } from 'fs'
import { join } from 'path'
const fishIcon = './src/DayNews/assets/icons/fish.png'
const bilibiliIcon = './src/DayNews/assets/icons/bilibili.png'
const bgmIcon = './src/DayNews/assets/icons/bgm.png'
const itIcon = './src/DayNews/assets/icons/it.png'
const gameIcon = './src/DayNews/assets/icons/game.png'
const hitokotoIcon = './src/DayNews/assets/icons/hitokoto.png'
const mahiroLogo = './src/DayNews/assets/1.no-bg.png'
const bottomFallback = './src/DayNews/assets/bottom.png'
const emptyFallback = './src/DayNews/assets/2.no-bg.png'

function getEncodeImgs(){
    const res = {
        fishIcon,
        bilibiliIcon,
        bgmIcon,
        itIcon,
        gameIcon,
        hitokotoIcon,
        mahiroLogo,
        bottomFallback,
        emptyFallback
    }

    // 获取当前工作目录的路径
    const currentPath = process.cwd();

    // 打印当前路径
    console.log(`当前工作目录是: ${currentPath}`);
    Object.keys(res).map((key) => {
        // 读取图片文件
        const imageBuffer = readFileSync(join(process.cwd(),(res as any)[key]));
        // 将Buffer转为Base64
        const base64Image = imageBuffer.toString('base64');
        (res as any)[key] = `data:image/png;base64,${base64Image}`
    })
    return res
}
function getDayOfWeek() {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const dayIndex = new Date().getDay(); // 获取星期的索引
    return days[dayIndex]; // 返回对应的星期名称
  }
  
export const getRenderData = async () => {
  const day = getDayOfWeek()
  let renderData: IDayNewsData = dayNewsDataFallback
  
  console.log(` get all remote data`)
  const remoteData = await getAllData()
  renderData.timestamp = dayjs().valueOf(),
  renderData.bilibiliHotTopic = remoteData.bili,
  renderData.currentDayNewBangumi = (bangumi as any)[day],
  renderData.techNews = remoteData.tech,
  renderData.gameNews = remoteData.game,
  renderData.hitokoto = remoteData.hitokoto,
  console.log(` get all remote data success`)
  const imgs2base64 = getEncodeImgs()
  renderData.base64Imgs = imgs2base64
  return renderData
}

