import $ from 'cheerio'
import { v5 as UUID } from 'uuid'

import Taxonomy from './taxonomy'

export function cleanText (string) {
  const $html = getDOM(`<p>${string}</p>`)
  return $html.text()
}

export function generateUUID (url) {
  return UUID(url, UUID.URL)
}

export function getAdditionalData (platform, html) {
  const compressed = html.replace(/^\s+|\s+$/g, '')
  let data = null

  // Check if this is the Shopify Platform, as we can grab missing data from their Analytics
  if (platform === 'shopify') {
    const regex = /window\.ShopifyAnalytics\.lib\.track\("Viewed Product",{([^}]+)}\);/g
    const found = compressed.match(regex)

    if (found && found[0].indexOf('window.ShopifyAnalytics.lib.track') > -1) {
      let meta = found[0]

      meta = meta.replace('window.ShopifyAnalytics.lib.track("Viewed Product",', '')
      meta = meta.replace(');', '')

      try {
        const item = JSON.parse(meta)

        data = {
          brand: item.brand || null,
          category: item.category || null,
          currency: item.currency || null,
          id: item.productId || null,
          name: item.name || null,
          price: item.price || null,
          sku: item.sku || null
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  }

  return data
}

export function getCategories (data) {
  let categories = []

  // Check for JSON+LD Breadcrumb Navigation
  if (data.jsonld && data.jsonld.BreadcrumbList && data.jsonld.BreadcrumbList[0].itemListElement) {
    data.jsonld.BreadcrumbList[0].itemListElement.forEach(crumb => {
      categories.push(cleanText(crumb.item.name))
    })
  }

  if (categories.length === 0 && data.metatags && data.metatags['og:type'] && data.metatags['og:type'][0] === 'product') {
    if (data.metatags.google_product_category) {
      const category = data.metatags.google_product_category[0]
      categories = /^\d+$/.test(category)
        ? Taxonomy(category)
        : categories.split(' > ')
    } else if (data.metatags.item_group_id) {
      categories = data.metatags.item_group_id
    } else if (data.metatags['product:item_group_id']) {
      categories = data.metatags['product:item_group_id']
    }
  }

  return categories.length > 0 ? categories : null
}

export function getDOM (html) {
  let $html

  if (typeof html === 'string') {
    $html = $.load(html, { xmlMode: true })
  } else if ($(html).cheerio) {
    $html = html
  } else {
    throw new Error('Invalid argument: pass valid html string or cheerio object')
  }

  return $html
}

export function getPlatform (html) {
  // Check if this is a Commerce Cloud E-Commerce site
  if (html.indexOf('demandware.store') > -1) {
    return 'commerce-cloud'
  }

  // Check if this is a Shopify E-Commerce site
  if (html.indexOf('window.Shopify') > -1) {
    return 'shopify'
  }

  return 'unknown'
}

export function getProduct (data) {
  let item = null
  const product = {}

  // Check for JSON+LD Product Data
  if (data.jsonld && data.jsonld.Product) {
    item = data.jsonld.Product[0]

    product.id = item.productID || null
    product.sku = item.sku || null
    product.mpn = item.mpn || null
    product.model = item.model || null
    product.name = cleanText(item.name) || null
    product.description = cleanText(item.description) || null
    product.url = item.url || null
    product.image = typeof item.image === 'object' ? item.image : typeof item.image === 'string' ? [item.image] : null

    if (item.depth || item.height || item.size || item.weight || item.width) {
      product.specifications = {
        depth: item.depth || null,
        height: item.height || null,
        size: item.size || null,
        weight: item.weight || null,
        width: item.width || null
      }
    }

    if (item.brand && item.brand.name) {
      product.brand = item.brand.name
    }

    if (item.offers) {
      const offer = Object.prototype.toString.call(item.offers) === '[object Array]' ? item.offers[0] : item.offers

      product.price = {
        validUntil: offer.priceValidUntil || null,
        currency: offer.priceCurrency,
        price: offer.price
      }

      if (offer.availability) {
        product.availability = {
          backOrder: offer.availability.indexOf('BackOrder') > -1,
          discontinued: offer.availability.indexOf('Discontinued') > -1,
          inStock: offer.availability.indexOf('InStock') > -1,
          inStoreOnly: offer.availability.indexOf('InStoreOnly') > -1,
          limitedAvailability: offer.availability.indexOf('LimitedAvailability') > -1,
          onlineOnly: offer.availability.indexOf('OnlineOnly') > -1,
          outOfStock: offer.availability.indexOf('OutOfStock') > -1,
          preOrder: offer.availability.indexOf('PreOrder') > -1,
          preSale: offer.availability.indexOf('PreSale') > -1,
          soldOut: offer.availability.indexOf('SoldOut') > -1
        }
      }

      if (offer.itemCondition) {
        product.condition = {
          isDamaged: offer.itemCondition.indexOf('DamagedCondition') > -1,
          isNew: offer.itemCondition.indexOf('NewCondition') > -1,
          isRefurbished: offer.itemCondition.indexOf('RefurbishedCondition') > -1,
          isUsed: offer.itemCondition.indexOf('UsedCondition') > -1
        }
      }
    }

    if (item.aggregateRating) {
      item.rating = {
        best: item.aggregateRating.bestRating,
        count: item.aggregateRating.reviewCount,
        value: item.aggregateRating.ratingValue,
        worst: item.aggregateRating.worstRating
      }
    }
  }

  // Check for JSON+LD Product Data
  if (data.microdata && data.microdata.Product) {
    item = data.microdata.Product[0]

    product.id = item.productID || product.id
    product.sku = item.sku || product.sku
    product.mpn = item.mpn || product.mpn
    product.model = item.model || product.model
    product.name = cleanText(item.name) || product.name
    product.description = cleanText(item.description) || product.description
    product.url = item.url || product.url
    product.image = typeof item.image === 'object' ? item.image : typeof item.image === 'string' ? [item.image] : product.image

    if (!product.specifications && (item.depth || item.height || item.size || item.weight || item.width)) {
      product.specifications = {
        depth: item.depth || null,
        height: item.height || null,
        size: item.size || null,
        weight: item.weight || null,
        width: item.width || null
      }
    }

    if (!product.brand && item.brand && item.brand.name) {
      product.brand = item.brand.name
    }

    if (item.offers) {
      const offer = Object.prototype.toString.call(item.offers) === '[object Array]' ? item.offers[0] : item.offers

      if (!product.price) {
        product.price = {
          validUntil: offer.priceValidUntil || null,
          currency: offer.priceCurrency,
          price: offer.price
        }
      }

      if (!product.availability && offer.availability) {
        product.availability = {
          backOrder: offer.availability.indexOf('BackOrder') > -1,
          discontinued: offer.availability.indexOf('Discontinued') > -1,
          inStock: offer.availability.indexOf('InStock') > -1,
          inStoreOnly: offer.availability.indexOf('InStoreOnly') > -1,
          limitedAvailability: offer.availability.indexOf('LimitedAvailability') > -1,
          onlineOnly: offer.availability.indexOf('OnlineOnly') > -1,
          outOfStock: offer.availability.indexOf('OutOfStock') > -1,
          preOrder: offer.availability.indexOf('PreOrder') > -1,
          preSale: offer.availability.indexOf('PreSale') > -1,
          soldOut: offer.availability.indexOf('SoldOut') > -1
        }
      }

      if (!product.condition && offer.itemCondition) {
        product.condition = {
          isDamaged: offer.itemCondition.indexOf('DamagedCondition') > -1,
          isNew: offer.itemCondition.indexOf('NewCondition') > -1,
          isRefurbished: offer.itemCondition.indexOf('RefurbishedCondition') > -1,
          isUsed: offer.itemCondition.indexOf('UsedCondition') > -1
        }
      }
    }

    if (!product.rating && item.aggregateRating) {
      item.rating = {
        best: item.aggregateRating.bestRating,
        count: item.aggregateRating.reviewCount,
        value: item.aggregateRating.ratingValue,
        worst: item.aggregateRating.worstRating
      }
    }
  }

  // Check for Metatag Product data
  // SEE: https://developers.facebook.com/docs/marketing-api/catalog/reference/#og-tags
  if (data.metatags && data.metatags['og:type'] && data.metatags['og:type'][0] === 'product') {
    const tag = data.metatags

    if (!product.id && tag.productID) {
      product.id = cleanText(tag.productID[0])
    } else if (!product.id && tag.id) {
      product.id = cleanText(tag.id[0])
    }

    if (!product.name && tag['og:title']) {
      product.name = cleanText(tag['og:title'][0])
    } else if (!product.name && tag.title) {
      product.name = cleanText(tag.title[0])
    }

    if (!product.description && tag['og:description']) {
      product.description = cleanText(tag['og:description'][0])
    } else if (!product.description && tag.description) {
      product.description = cleanText(tag.description[0])
    }

    if (!product.url && tag['og:url']) {
      product.url = tag['og:url'][0]
    } else if (!product.url && tag.url) {
      product.url = tag.url[0]
    }

    if (!product.image && (tag['og:image:secure_url'] || tag['og:image'])) {
      product.image = tag['og:image:secure_url']
        ? tag['og:image:secure_url']
        : tag['og:image']
    }

    if (!product.brand && tag['product:brand']) {
      product.brand = tag['product:brand'][0]
    } else if (!product.brand && tag.brand) {
      product.brand = tag.brand[0]
    }

    // Fetch Availability from Meta Data
    if (!product.availability && tag['product:availability']) {
      const availability = tag['product:availability'][0]
      product.availability = {
        discontinued: availability.indexOf('discontinued') > -1,
        inStock: availability.indexOf('in stock') > -1,
        outOfStock: availability.indexOf('out of stock') > -1,
        preOrder: availability.indexOf('available for order') > -1
      }
    } else if (!product.availability && tag.availability) {
      const availability = tag.availability[0]
      product.availability = {
        discontinued: availability.indexOf('discontinued') > -1,
        inStock: availability.indexOf('in stock') > -1,
        outOfStock: availability.indexOf('out of stock') > -1,
        preOrder: availability.indexOf('available for order') > -1
      }
    }

    // Fetch Condition from Meta Data
    if (!product.condition && tag['product:condition']) {
      const itemCondition = tag['product:condition'][0]
      product.condition = {
        isNew: itemCondition.indexOf('new') > -1,
        isRefurbished: itemCondition.indexOf('refurbished') > -1,
        isUsed: itemCondition.indexOf('used') > -1
      }
    } else if (!product.condition && tag.condition) {
      const itemCondition = tag.condition[0]
      product.condition = {
        isNew: itemCondition.indexOf('new') > -1,
        isRefurbished: itemCondition.indexOf('refurbished') > -1,
        isUsed: itemCondition.indexOf('used') > -1
      }
    }

    // Fetch Price from Meta Data
    if (!product.price && tag['og:price:currency'] && tag['og:price:amount']) {
      product.price = {
        currency: tag['og:price:currency'][0],
        price: tag['og:price:amount'][0]
      }
    } else if (!product.price && tag['product:price:currency'] && tag['product:price:amount']) {
      product.price = {
        currency: tag['product:price:currency'][0],
        price: tag['product:price:amount'][0]
      }
    } else if (!product.price && tag.price && tag.priceCurrency) {
      product.price = {
        currency: tag.priceCurrency[0],
        price: tag.price[0]
      }
    }

    // Fetch Sale Price from Meta Data
    if (!product.price && tag['product:sale_price:currency'] && tag['product:sale_price:amount']) {
      product.salePrice = {
        currency: tag['product:sale_price:currency'][0],
        price: tag['product:sale_price:amount'][0],
        startDate: tag['product:sale_price_dates:start'] ? tag['product:sale_price_dates:start'][0] : null,
        endDate: tag['product:sale_price_dates:end'] ? tag['product:sale_price_dates:end'][0] : null
      }
    }
  }

  // Let's do a quick sweep for missing product data based on platform
  if (data.additionalData) {
    // Update Product ID if Missing
    if (!product.id && data.additionalData.id) {
      product.id = data.additionalData.id
    }

    // Update Product SKU if Missing
    if (!product.sku && data.additionalData.sku) {
      product.sku = data.additionalData.sku
    }

    // Update Product Name if Missing
    if (!product.name && data.additionalData.name) {
      product.name = data.additionalData.name
    }

    // Update Product Brand if Missing
    if (!product.brand && data.additionalData.brand) {
      product.brand = data.additionalData.brand
    }

    // Update Product Price if Missing
    if (!product.price && data.additionalData.price && data.additionalData.currency) {
      product.price = {
        currency: data.additionalData.currency,
        price: data.additionalData.price
      }
    }

    if (!product.category && data.additionalData.category) {
      product.category = Object.prototype.toString.call(data.additionalData.category) === '[object Array]'
        ? data.additionalData.category
        : [data.additionalData.category]
    }
  }

  return product
}

export function getSeller (url) {
  if (url.startsWith('http')) {
    const client = new URL(url)
    const urlParts = client.hostname.split('.')

    return {
      name: urlParts[urlParts.length - 2],
      url: client.origin || null
    }
  }
}
