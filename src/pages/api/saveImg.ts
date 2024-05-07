// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IDayNewsData, dayNewsDataFallback } from "@/DayNews/interface";
import { getRenderData } from "@/utils/getRenderData";
import type { NextApiRequest, NextApiResponse } from "next";
import * as puppeteer from 'puppeteer'
import path from 'path'

const browser = await puppeteer.launch({args: ['--no-sandbox', '--lang=zh-CN,zh'],
defaultViewport: {
    width: 780,
    height: 2210,
    deviceScaleFactor: 2,
},
headless: true})

function delay(time: number) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }
  


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
    const page = await browser.newPage()
    await page.goto('http://localhost:3000',{waitUntil: 'networkidle0'},)
    // await page.waitForNavigation()
    await page.content();
    const element = await page.$("body");
    //对整个页面截图
    await element!.screenshot({
        path: path.resolve(`./output/output.png`),  //图片保存路径
        type: 'png',
    })
    console.log('保存截图')
    await page.close()
    res.status(200).json({
        success: true
    });
}
