import $ from 'cheerio'
import sanitizeHtml from 'sanitize-html'

import MetaTagsParser from './parsers/metatag-parser'
import MicroRdfaParser from './parsers/micro-rdfa-parser'
import JsonldParser from './parsers/jsonld-parser'
import ProductParser from './parsers/product-parser'

if (!global._babelPolyfill) {
  require('babel-polyfill')
}

export default function () {
  let $html = null

  const loadCheerioObject = function (_$html) {
    $html = _$html
  }

  const extract = function (html, options) {
    // Cleanup HTML as parser will fail to extract data from within unclosed HTML Tags
    if (html) {
      html = sanitizeHtml(html, {
        allowedTags: false,
        allowedAttributes: false,
        allowVulnerableTags: true
      })
    }

    if (!($html && $html.prototype && $html.prototype.cheerio)) {
      $html = $.load(html, options)
    }

    const jsonld = JsonldParser($html)
    const metatags = MetaTagsParser($html)
    const microdata = MicroRdfaParser(html, 'micro')
    const rdfa = MicroRdfaParser(html, 'rdfa')
    const product = ProductParser(html, jsonld, metatags, microdata, rdfa)

    return {
      metatags,
      microdata,
      rdfa,
      jsonld,
      product
    }
  }

  return {
    extract,
    loadCheerioObject
  }
}
