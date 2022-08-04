#!/usr/bin/env node

const marked = require('marked')
const TerminalRenderer = require('marked-terminal')

const {
  moduleSizeTree,
  toMarkdown
}= require('./index')

const [path = './'] = process.argv.slice(2)

marked.setOptions({
  renderer: new TerminalRenderer()
})

moduleSizeTree(path)
  .then(toMarkdown)
  .then(marked)
  .then(console.log)
