#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const program = require('commander')
const package = require('../package.json')
const { readXlsx } = require('../dist/read-excel.js')

program
.version(package.version)
.command('generate')
.description('解析权限配置生成 keycloak 配置')
.argument('<file>', '权限配置的excel文件地址')
.option('-o, --ouput', '输出文件地址', './authz.config.json')
.option('-c, --config', '配置文件地址 json')
.action((file, options) => {
    const config = undefined
    const dirPath = path.resolve(__dirname, file)
    if(options.conf) config = JSON.parse(fs.readFileSync(options.config))
    readXlsx(dirPath, (options || {}).ouput, config)
})

program.parse()