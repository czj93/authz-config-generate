const path = require('path')
import XLSX, { readFile, utils } from 'xlsx'

import { ResourcesTree, ResourceType } from './resources-tree'


export function readXlsx (path) {
    let workbook: XLSX.WorkBook = readFile(path)
    let sheetNames = workbook.SheetNames
    const sheets = sheetNames.map(sheetName => parseSheet(sheetName, workbook.Sheets[sheetName]))
    
    return sheets
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

// const testMatri = [
//     [ 'menu1', 'menu1-1', 'menuu1-1-1' ],
//     [ , , 'menu1-1-2'],
//     [ , , 'menu1-1-3'],
//     [ , 'menu1-2', 'menu1-2-1'],
//     [ , , 'menu1-2-2'],
//     ['menu2', 'menu2-1'],
//     ['menu3', 'menu3-1', 'menu3-1-1'],
// ]






