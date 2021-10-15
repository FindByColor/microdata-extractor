#!/usr/bin/env node

'use strict'

const chalk = require('chalk')
const path = require('path')
const yargs = require('yargs')

// Generate CLI Options
const cli = yargs
  .scriptName('extract')
  .usage(`\n${chalk.cyan.bold('Usage:')} ${chalk.bold.green('extract')} https://www.website.com ${chalk.dim('--options')}`)
  .updateStrings({
    'Options:': chalk.cyan('Options:\n'),
    'Examples:': chalk.cyan('Examples:\n')
  })
  .fail((msg, err, yargs) => {
    yargs.showHelp()
    console.log(`\n${chalk.bold.red('✖ ERROR:')} ${msg}\n`)
    process.exitCode = 1
  })
  .options({
    cache: {
      alias: 'c',
      describe: 'Cache Expire for HTTP Requests',
      type: 'number',
      default: 3600000
    },
    jsonld: {
      alias: 'j',
      describe: 'Extract JSON+LD',
      type: 'boolean',
      default: false
    },
    metatags: {
      alias: 'm',
      describe: 'Extract META Tags',
      type: 'boolean',
      default: false
    },
    microdata: {
      alias: 'd',
      describe: 'Extract Microdata',
      type: 'boolean',
      default: false
    },
    product: {
      alias: 'p',
      describe: 'Extract Product Data',
      type: 'boolean',
      default: false
    },
    rdfa: {
      alias: 'r',
      describe: 'Extract RDFa',
      type: 'boolean',
      default: false
    },
    timeout: {
      alias: 't',
      describe: 'HTTP Request Timeout in Milliseconds',
      type: 'number',
      default: 30000
    },
    output: {
      alias: 'o',
      describe: 'Save Output to File Path',
      type: 'string',
      default: null
    }
  })
  .command('*', 'Run Microdata Extractor')
  .wrap(100)
  .example('extract https://website.com', 'Extract All Data')
  .example('extract https://website.com --jsonld', 'Extract Only JSON+LD')
  .example('extract https://website.com --metatags', 'Extract Only Meta Tags')
  .example('extract https://website.com --microdata', 'Extract Only Micro Data')
  .example('extract https://website.com --product', 'Extract Only Product Data')
  .example('extract https://website.com --rdfa', 'Extract Only RDFa Data')
  .example('extract https://website.com --cache 0', 'Disable Cached Requests')
  .example('extract https://website.com --timeout 30000', 'Set Request Timeout to 30 Seconds')
  .example('extract https://website.com --output ~/file.json', 'Save Output to JSON File')
  .help('help')
  .alias('help', 'h')
  .epilogue(`${chalk.bold.cyan('Need Help?')} https://github.com/FindByColor/microdata-extractor`)
  .version().argv

// Load CLI Command
if (cli._.length === 0 && !cli.config) {
  yargs.showHelp()
} else {
  require(path.join(__dirname, '../commands/extract.js'))(cli)
}

module.exports = cli
