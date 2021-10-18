import { generateUUID, getAdditionalData, getCategories, getPlatform, getProduct, getSeller } from './utils'

export default (url, html, jsonld, metatags, microdata, rdfa) => {
  const platform = getPlatform(html)
  const additionalData = getAdditionalData(platform, html)

  return {
    id: generateUUID(url),
    platform: platform,
    seller: getSeller(url),
    category: getCategories({ jsonld, metatags, microdata, rdfa }),
    item: getProduct({ jsonld, metatags, microdata, rdfa, additionalData })
  }
}
