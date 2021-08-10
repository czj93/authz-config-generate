const fs = require('fs')
const path = require('path')
const config = require('./config.json')
import XLSX, { readFile, utils } from 'xlsx'

import { AuthConfig } from './interfaces/index' 
import { Transform, TransformOptions } from './transform'
import { ResourcesTree, ResourcesTreeOption } from './resources-tree'

export function readXlsx (path, outDir?: string, customConfig?) {
    const out = outDir || './authz.config.json'

    let workbook: XLSX.WorkBook = readFile(path)
    let _config = customConfig || config

    const authzConfig = parse(workbook, _config.excelConfig, _config.transformOptions)
    
    fs.writeFileSync(out, JSON.stringify(authzConfig, null, 4))
}

export function parse(
    workbook: XLSX.WorkBook,
    excelConfig: ResourcesTreeOption,
    transformOptions: TransformOptions,
): AuthConfig {
    let sheetNames = workbook.SheetNames
    const sheets = sheetNames.map(sheetName => parseSheet(sheetName, workbook.Sheets[sheetName], excelConfig))
    
    const authzConfig = new Transform(sheets[0], transformOptions).transform()

    return authzConfig
}


const parseSheet = (sheetName, sheet: XLSX.Sheet, config: ResourcesTreeOption) => {
    const data = utils.sheet_to_json(sheet, { header: 1 })
    fillTables(data)
    const resourcesTree = new ResourcesTree(data, config)
    return resourcesTree
}

const fillTables = (tabels) => {
    // const maxLength = Math.max.apply(Math, tabels.map(row => row.length))
    tabels.forEach((row, r) => {
        row.forEach((cell, c) => {
            if(!cell) tabels[r][c] = null
        })
    })
}

// readXlsx(path.resolve(__dirname, '../bin/temp.xlsx'))

