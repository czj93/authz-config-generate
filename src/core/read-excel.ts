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

    const resourcesTree = new ResourcesTree(data, {
        menuRow: 2,
        menuCol: 0,
        menuRowCount: 35,
        menuColCount: 3,
    })
    return resourcesTree
}

// const testMatri = [
//     [ 'menu1', 'menu1-1', 'menuu1-1-1' ],
//     [ , , 'menu1-1-2'],
//     [ , , 'menu1-1-3'],
//     [ , 'menu1-2', 'menu1-2-1'],
//     [ , , 'menu1-2-2'],
//     ['menu2', 'menu2-1'],
//     ['menu3', 'menu3-1', 'menu3-1-1'],
// ]






