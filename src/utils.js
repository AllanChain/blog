/**
 * Pad string / number with leading zero to become 2-digit
 * @param {(string|number)} s string or nmuber to be padded
 */
const pad2 = s => ('0' + s).slice(-2)

module.exports = {
  /**
   * Capitalize first char of string
   * @param {string} s String to capitalize
   */
  capitalize (s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  },
  /**
   * Format Date-readable string to human-readabel string
   * @param {string} s Date string to format, e.g. 2020-02-02T20:20Z
   */
  formatTime (s) {
    const d = new Date(s)
    return (
      `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ` +
      `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
    )
  },
  /**
   * Prefix with BASE_URL if not on other domain
   * @param {string} url URL to fix
   */
  fixUrl (url) {
    if (url.startsWith('http')) return url
    return process.env.GRIDSOME_BASE_URL + url
  }
}
