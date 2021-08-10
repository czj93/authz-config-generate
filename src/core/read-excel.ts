const path = require('path')
import XLSX, { readFile, utils } from 'xlsx'

import { Transform, TransformOptions } from './transform'
import { ResourcesTree, ResourceType } from './resources-tree'
const fs = require('fs')

export function readXlsx (path, outDir?: string) {
    let workbook: XLSX.WorkBook = readFile(path)
    let sheetNames = workbook.SheetNames
    const sheets = sheetNames.map(sheetName => parseSheet(sheetName, workbook.Sheets[sheetName]))
    
    const config: TransformOptions = {
        clientId: 'test'
    } 
    const authzConfig = new Transform(sheets[0], config).transform()

    const out = outDir || './authz.config.json'
    fs.writeFileSync(out, JSON.stringify(authzConfig, null, 4))
}


const parseSheet = (sheetName, sheet: XLSX.Sheet) => {
    const data = utils.sheet_to_json(sheet, { header: 1 })
    fillTables(data)
    const resourcesTree = new ResourcesTree(data, {
        menuRow: 2,
        menuCol: 0,
        menuRowCount: 35,
        menuColCount: 4,
        rolesHeader: {
            row: 1,
            col: 4,
            rowCount: 1,
            colCount: 3,
        },
        btnRow: 2,
        btnCol: 3,
    })
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

readXlsx(path.resolve(__dirname, '../bin/temp.xlsx'))

