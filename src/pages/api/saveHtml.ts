// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IDayNewsData, dayNewsDataFallback } from "@/DayNews/interface";
import { getRenderData } from "@/utils/getRenderData";
import { writeFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
    const { html } = req.body;
    const cacheFile = './output.html'
    writeFileSync(cacheFile, html, 'utf-8')
    res.status(200).json({html});
}
