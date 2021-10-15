
export default (html, jsonld, metatags, microdata, rdfa) => {
  const product = {
    platform: 'unknown'
  }

  // Check if this is a Commerce Cloud E-Commerce site
  if (html.indexOf('demandware.store') > -1) {
    product.platform = 'commerce-cloud'
  }

  /**
   * TODO: Make sure we have coverage for these top 10 e-commerce platforms
   *
   * 1. Salesforce Commerce Cloud
   * 2. Shopify
   * 3. Magento
   */

  /**
   * TODO: Extract the following Product Data from jsonld, metatags, microdata & rdfa
   *
   * SAMPLE JSON:
   *
   * {
   *    id: '', // Our Internal ID ( probably md5 hash of URL )
   *    sku: '408378150', // merchant specific
   *    mpn: '408378150', // global id
   *    model: '',
   *    name: 'SPRING BREAK Snowboards Spring Break Team Tee',
   *    description: 'Spring break Snowboards Spring Break Team Tee. Screen printed Graphics on Chest, Back and Sleeves. Ribbed crew neckline. Long sleeves. Pre Laundered. 100% Cotton. Machine wash. Imported.',
   *    seller: {
   *      name: 'Some Business',
   *      url: 'http://website.com'
   *    },
   *    image: [
   *      'https://cdn-us-ec.yottaa.net/57f4626c312e584b1a000020/www.website.com/v~4b.1d3.0.0/dw/image/v2/BBLQ_PRD/on/demandware.static/-/Sites-master-catalog/default/dwd2f566f9/website/images/catalog/1000x1000/408378150.jpg',
   *      'https://cdn-us-ec.yottaa.net/57f4626c312e584b1a000020/o~f_webp/v~4b.1d3.0.0/https://www.website.com/dw/image/v2/BBLQ_PRD/on/demandware.static/-/Sites-master-catalog/default/dw4d29fcc2/website/images/catalog/1000x1000/408378150a.jpg',
   *      'https://cdn-us-ec.yottaa.net/57f4626c312e584b1a000020/o~f_webp/v~4b.1d3.0.0/https://www.website.com/dw/image/v2/BBLQ_PRD/on/demandware.static/-/Sites-master-catalog/default/dwaa0cd8fd/website/images/catalog/1000x1000/408378150b.jpg'
   *    ],
   *    brand: {
   *      name: 'SPRING BREAK',
   *      url: ''
   *    },
   *    offer: {
   *      url: 'https://www.website.com/product/spring-break-snowboards-spring-break-team-tee/408378150.html?dwvar_408378150_color=150&cgid=mens-clothing-t-shirts-graphic-tees#start=1',
   *      availability: {
   *        in_stock: true,
   *        quantity: 123
   *      },
   *      price: {
   *        validUntil: '2021-11-20',
   *        currency: 'USD',
   *        regular: 12.34
   *        sale: 10.00
   *      },
   *      attribute: {
   *        weight: '',
   *        dimension: '',
   *        color: [
   *          'white'
   *        ],
   *        size: [
   *          'S',
   *          'M',
   *          'L',
   *          'XL'
   *        ]
   *      },
   *    },
   *    rating: {
   *      score: 4.8,
   *      count: 1234
   *    },
   *    category: [
   *      'Men',
   *      'Clothing',
   *      'T-Shirts',
   *      'Graphic Tees'
   *    ],
   *    created_date: '2021-09-17T01:12:45.442Z',
   *    modified_date: '2021-10-15T03:50:19.442Z',
   *    deleted_date: ''
   * }
   */

  return product
}
