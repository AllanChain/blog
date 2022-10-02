export const isDarkColor = (color: string, threshold = 101) => {
  const rgb = parseInt(color, 16) // convert rrggbb to decimal
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b // per ITU-R BT.709
  return luma < threshold
}

export const formatDate = (date: Date) => {
  return date.toISOString().slice(0, 10)
}

export const formatLocalDate = (date: Date) => {
  return date.toLocaleString()
}

export const prefixLink = (link: string) => import.meta.env.BASE_URL + link

export const postLink = (slug: string) => {
  return prefixLink(`post/${slug}/`)
}

export const charIsZH = (c: string) => '\u4e00' <= c && c <= '\u9fa5'

export const lang = (text: string) => {
  text = text
    .replace(/<code.*?>.*?<\/code>/g, '')
    .replace(/\<.*?\>/g, '')
    .replace(/[ \n\r，。？！；、（）,\.\?!;\(\)]/g, '')
  const zhChars = Array.from(text).filter(charIsZH).length
  if (text.length > 200) {
    return zhChars > text.length * 0.1 ? 'zh-CN' : 'en'
  } else {
    return zhChars > 0 ? 'zh-CN' : 'en'
  }
}
