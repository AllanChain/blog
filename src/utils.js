const magicCommonJpegHead =
  '/9j/2wBDAFA3PEY8MlBGQUZaVVBfeMiCeG5uePWvuZHI' +
  '/'.repeat(52) +
  '2wBDAVVaWnhpeOuCguv' +
  '/'.repeat(73) +
  'wAARCA'
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
   * Format Date-readable string to yyyy-mm-dd HH:MM
   * If time part not provided, default is UTC 00:00
   * @param {string} s Date string to format, e.g. 2020-02-02T20:20Z
   * @returns {string}
   */
  formatTime (s) {
    const d = new Date(s)
    return (
      `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}` +
      ` ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
    )
  },
  /**
   * Compress JPEG data URI
   * @param {string} uri The input URI
   * @returns {string} The compressed URI
   */
  compressDataURI (uri) {
    return uri
      .replace(magicCommonJpegHead, '')
      .replace(new RegExp('A'.repeat(18), 'g'), '$')
  },
  /**
   * Decompress JPEG data URI
   * @param {string} compressed  The compressed URI
   * @returns {string} The decoded URI
   */
  decompressDataURI (compressed) {
    // capability for no image at all
    if (!compressed) return null
    return 'data:image/jpeg;base64,' + magicCommonJpegHead +
      compressed.replace(/\$/g, 'A'.repeat(18))
  },
  /**
   * Judge if the luminance of the color is smaller than the threshold
   * @param {string} color color to judge, rrggbb format
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
