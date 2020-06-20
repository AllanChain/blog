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
      `${d.getFullYear()}-${d.getMonth()}-${d.getDate()} ` +
      `${d.getHours()}:${d.getMinutes()}`
    )
  }
}
