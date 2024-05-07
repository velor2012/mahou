import Image from "next/image";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import { DayNews } from '../DayNews'
export default function Home() {
  return (
        <DayNews />
  );
}
