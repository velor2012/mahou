import { IDayNewsData, dayNewsDataFallback } from '@/DayNews/interface'
import bangumi from '@/data/bangumi.json'
import { getAllData } from './data';
import dayjs from 'dayjs';
function getDayOfWeek() {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const dayIndex = new Date().getDay(); // 获取星期的索引
    return days[dayIndex]; // 返回对应的星期名称
  }
export const getRenderData = async () => {
  const day = getDayOfWeek()
  let renderData: IDayNewsData = dayNewsDataFallback
  
  console.info(` get all remote data`)
  const remoteData = await getAllData()
  renderData.timestamp = dayjs().valueOf(),
  renderData.bilibiliHotTopic = remoteData.bili,
  renderData.currentDayNewBangumi = (bangumi as any)[day],
  renderData.techNews = remoteData.tech,
  renderData.gameNews = remoteData.game,
  renderData.hitokoto = remoteData.hitokoto,
  console.info(` get all remote data success`)
  return renderData
}
