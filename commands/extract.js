'use strict'

const chalk = require('chalk')
const fs = require('fs')
const https = require('https')
const path = require('path')
const md5 = require('md5')
const rimraf = require('rimraf')

const Microdata = require('../dist').default

const maxCacheAge = 3600000
const cacheDir = path.join(__dirname, '../', '.cache')

const purgeOldCache = () => {
  fs.readdir(cacheDir, (err, files) => {
    if (err) return

    files.forEach((file, index) => {
      if (file === '.gitignore') return

      fs.stat(path.join(cacheDir, file), (err, stat) => {
        if (err) return

        const now = new Date().getTime()
        const endTime = new Date(stat.ctime).getTime() + maxCacheAge

        if (now > endTime) {
          return rimraf(path.join(cacheDir, file), () => {})
        }
      })
    })
  })
}

module.exports = async options => {
  const url = (options && options._) ? options._[0] : null

  options.all = true

  // Sanity check to not return all if just a single custom output is present
  if (options.jsonld || options.metatags || options.microdata || options.product || options.rdfa) {
    options.all = false
  }

  if (url) {
    const cacheKey = md5(url)
    const cacheFile = path.join(cacheDir, cacheKey)

    const fetch = new URL(url)
    const timeout = options.timeout || 30000

    const hasCache = fs.existsSync(cacheFile)
    let useCache = false

    if (hasCache) {
      const maxAge = (typeof options.cache === 'number') ? options.cache : maxCacheAge
      const stat = fs.statSync(cacheFile)
      const now = new Date().getTime()
      const timestamp = new Date(stat.ctime).getTime()

      if (now < timestamp + maxAge) {
        useCache = true
      }
    }

    const parseHTML = (html, cache) => {
      const { jsonld, metatags, microdata, product, rdfa } = Microdata().extract(html)
      const data = { jsonld, metatags, microdata, product, rdfa }

      // Check if we had any custom output settings
      if (!options.all && !options.jsonld) delete data.jsonld
      if (!options.all && !options.metatags) delete data.metatags
      if (!options.all && !options.microdata) delete data.microdata
      if (!options.all && !options.product) delete data.product
      if (!options.all && !options.rdfa) delete data.rdfa

      const output = JSON.stringify(data)

      // Check if we should save output to file
      if (options.output) {
        fs.writeFileSync(options.output, output, (e) => {
          console.log(`\n${chalk.bold.red('✖ ERROR:')} ${e.message}\n`)
        })
      } else {
        console.log(output)
      }

      // Cache Output from URL
      if (cache) {
        fs.writeFileSync(cacheFile, html, (e) => {
          console.log(`\n${chalk.bold.red('✖ ERROR:')} ${e.message}\n`)
        })
      }

      // Cache Garbage Collection
      purgeOldCache()
    }

    if (useCache) {
      const html = fs.readFileSync(cacheFile, { encoding: 'utf8' }).toString()
      parseHTML(html)
    } else {
      const request = await https.get(fetch, res => {
        let html = ''

        res.on('data', chunk => {
          html += chunk
        })

        res.on('end', () => {
          parseHTML(html, true)
        })
      }).on('error', e => {
        console.log(`\n${chalk.bold.red('✖ ERROR:')} ${e.message}\n`)
      }).on('socket', (socket) => {
        socket.setTimeout(timeout, function () {
          request.abort()
        })
      })
    }
  }
}
