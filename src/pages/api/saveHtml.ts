// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IDayNewsData, dayNewsDataFallback } from "@/DayNews/interface";
import { getRenderData } from "@/utils/getRenderData";
import { writeFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import nodeHtmlToImage from 'node-html-to-image'
type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
    const { html } = req.body;
    const cacheFile = 'output/output.html'
    writeFileSync(cacheFile, html, 'utf-8')

    const t = await nodeHtmlToImage({
        output: 'output/output.png',
        html: html
      })
    console.log('The image was created successfully!')
    res.status(200).json({html});
}
