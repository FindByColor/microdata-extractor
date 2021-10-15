/* eslint-env mocha */
import 'babel-polyfill'
import fs from 'fs'
import { assert } from 'chai'
import Microdata from '../src'

const fileReader = (fileName) => fs.readFileSync(fileName, { encoding: 'utf-8' })

/**
 * Test Basic Features
 */
const expected = JSON.parse(fileReader('test/resources/basic-features.json'))
const html = fileReader('test/resources/basic-features.html')
const { microdata, rdfa, metatags, jsonld, product } = Microdata().extract(html)

// NOTE: If you need to generate new output, uncomment this console statement
// console.log(JSON.stringify({ microdata, rdfa, metatags, jsonld }))
console.log(product)

describe('Microdata Extractor - Basic Features', function () {
  it('should find all elements with microdata', function () {
    assert.deepEqual(microdata, expected.microdata)
  })

  it('should find all elements with rdfa', function () {
    assert.deepEqual(rdfa, expected.rdfa)
  })

  it('should find embedded json-ld', function () {
    assert.deepEqual(jsonld, expected.jsonld)
  })

  it('should find embedded meta tags', function () {
    assert.deepEqual(metatags, expected.metatags)
  })
})
