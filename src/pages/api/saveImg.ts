// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IDayNewsData, dayNewsDataFallback } from "@/DayNews/interface";
import { getRenderData } from "@/utils/getRenderData";
import type { NextApiRequest, NextApiResponse } from "next";
import * as puppeteer from 'puppeteer'
import path from 'path'

const browser = await puppeteer.launch()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
    const page = await browser.newPage()
    await page.goto('http://localhost:3000')
    //对整个页面截图
    await page.screenshot({
        path: path.resolve(`./output/output.png`),  //图片保存路径
        type: 'png',
        fullPage: true //边滚动边截图
    })
    page.close()
    res.status(200).json({
        success: true
    });
}
