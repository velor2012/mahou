export enum ETemplate {
  // 日报
  dayNews = 'dayNews',
}

export interface ITemplateInfo {
  /**
   * [width, height]
   */
  size: [number, number]
}

export const TEMPLATE_INFO: Record<ETemplate, ITemplateInfo> = {
  [ETemplate.dayNews]: {
    size: [780, 2180],
  },
}
