// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { IDayNewsData, dayNewsDataFallback } from "@/DayNews/interface";
import { getRenderData } from "@/utils/getRenderData";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
    let t = dayNewsDataFallback
    // if (process.env.NODE_ENV === 'development') {
        t = await getRenderData() as IDayNewsData
    // }
    res.status(200).json(t);
}
