#!/usr/bin/env node
const program = require('commander')
const path = require('path')
// const readXlsx = require('../dist/read-excel')
const { readXlsx } = require('../dist/read-excel.js')

program
.version('0.1.0')
.command('read <dir>')
.description('create a ne project')
.action(dir => { 
    const dirPath = path.resolve(__dirname, dir)
    readXlsx(dirPath)
})

program.parse()