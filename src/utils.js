/**
 * Pad string / number with leading zero to become 2-digit
 * @param {(string|number)} s string or nmuber to be padded
 * @returns {string}
 */
const pad2 = s => ('0' + s).slice(-2)

module.exports = {
  /**
   * Capitalize first char of string
   * @param {string} s String to capitalize
   * @returns {string}
   */
  capitalize (s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  },
  /**
   * Format Date-readable string to human-readabel string
   * @param {string} s Date string to format, e.g. 2020-02-02T20:20Z
   * @returns {string}
   */
  formatTime (s) {
    const d = new Date(s)
    const date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
    let time = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
    if (time === '00:00') time = '11:11' // better default
    return `${date} ${time}`
  },
  /**
   * Prefix with BASE_URL if not on other domain
   * @param {string} url URL to fix
   * @returns {string}
   */
  fixUrl (url) {
    if (url.startsWith('http')) return url
    return process.env.GRIDSOME_BASE_URL + url
  },
  /**
   * Judge if the luminance of the color is smaller than the threshold
   * @param {string} color color to judge, rrggbb fromat
   * @param {number} threshold threshold
   * @returns {boolean}
   */
  isDarkColor (color, threshold = 40) {
    const rgb = parseInt(color, 16) // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = (rgb >> 0) & 0xff
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b // per ITU-R BT.709
    return luma < threshold
  }
}
