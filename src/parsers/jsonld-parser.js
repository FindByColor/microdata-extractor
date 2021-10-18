
import { getDOM } from './utils'
import $ from 'cheerio'

export default html => {
  const $html = getDOM(html)
  const jsonldData = {}

  $html('script[type="application/ld+json"]').each((index, item) => {
    try {
      const scriptText = $(item).get()[0].children[0].data.toString()

      if (!scriptText.charAt(0) === '{' && scriptText.charAt(0) === '[') {
        throw new Error('Invalid JSON+LD Markup')
      }

      let parsedJSON = JSON.parse(scriptText)

      if (!Array.isArray(parsedJSON)) {
        parsedJSON = [parsedJSON]
      }

      parsedJSON.forEach(obj => {
        const type = obj['@type']
        jsonldData[type] = jsonldData[type] || []
        jsonldData[type].push(obj)
      })
    } catch (e) {}
  })

  return JSON.stringify(jsonldData) !== '{}' ? jsonldData : null
}
