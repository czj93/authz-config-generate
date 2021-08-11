#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const program = require('commander')
const package = require('../package.json')
const { readXlsx } = require('../dist/parse.js')

program
.version(package.version)
.command('generate')
.description('解析权限配置生成 keycloak 配置')
.argument('<file>', '权限配置的excel文件地址')
.option('-o, --ouput', '输出文件地址', './authz.config.json')
.option('-c, --config', '配置文件地址 json')
.action((file, options) => {
    // const dirPath = path.resolve(__dirname, file)

    if(!file) {
        console.log('请输入模板文件')
        return
    }

    if(!fs.existsSync(file)) {
        console.log(`${file} 权限配置文件不存在`)
        return
    }

    if(!options.conf) options.conf = './config.json'

    if(!fs.existsSync(options.conf)) {
        console.log(`${options.conf} 配置文件不存在`)
        return
    }

    config = JSON.parse(fs.readFileSync(options.conf))

    readXlsx(file, (options || {}).ouput, config)
})

program
.command('init')
.description('生成初始化文件 配置模板 和 配置文件')
.action(() => {
    fs.copyFileSync(path.resolve(__dirname, './template.xlsx'), './template.xlsx')
    fs.copyFileSync(path.resolve(__dirname, './config.json'), './config.json')
})

program.parse()