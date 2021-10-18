/* eslint-env mocha */
import 'babel-polyfill'
import fs from 'fs'
import { assert } from 'chai'
import Microdata from '../src'

const fileReader = (fileName) => fs.readFileSync(fileName, { encoding: 'utf-8' })

// Test Configuration
const test = {
  id: 'commerce-cloud-under-armour',
  label: 'Commerce Cloud - Under Armour',
  url: 'https://www.underarmour.com/en-us/p/running/mens_ua_hovr_mega_2_clone_running_shoes/3024479.html?dwvar_3024479_color=102&start=0&breadCrumbLast=Running'
}

// Create File Paths
const fileExpected = `test/resources/${test.id}.json`
const fileSource = `test/resources/${test.id}.html`

// Get File Data
const html = fileReader(fileSource)
const { jsonld, metatags, microdata, product, rdfa } = Microdata().extract(test.url, html)
const results = JSON.stringify({ jsonld, metatags, microdata, product, rdfa })

// Update Test Output if --update flag present ( only works with `npm run test:single` )
if (process.argv.indexOf('--update') > -1) {
  console.log(`✔ Updated ${fileExpected}`)
  fs.writeFileSync(fileExpected, results)
}

// Build Comparison
const output = JSON.parse(results)
const expected = JSON.parse(fileReader(fileExpected))

// Run Tests
describe(`Microdata Extractor - ${test.label}`, function () {
  it('should find all elements with microdata', function () {
    assert.deepEqual(output.microdata, expected.microdata)
  })

  it('should find all elements with rdfa', function () {
    assert.deepEqual(output.rdfa, expected.rdfa)
  })

  it('should find embedded json-ld', function () {
    assert.deepEqual(output.jsonld, expected.jsonld)
  })

  it('should find embedded meta tags', function () {
    assert.deepEqual(output.metatags, expected.metatags)
  })

  it('should find embedded product', function () {
    assert.deepEqual(output.product, expected.product)
  })
})
