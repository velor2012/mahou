export const ensureFreeHdslb = (url: string) => {
  const parsed = new URL(url)
  const host = parsed.host
  // replace *.hdslb.com to s1.hdslb.com
  const newHost = host
    .split('.')
    .map((v, i) => (i === 0 ? 's1' : v))
    .join('.')
  parsed.host = newHost
  return parsed.toString()
}
