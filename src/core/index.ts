const fs = require('fs')
import XLSX, { readFile } from 'xlsx'

import { parse, ParseConfig } from './parse'

export function readXlsx (path: string, config: ParseConfig, outDir?: string) {
    const out = outDir || './authz.config.json'
    let workbook: XLSX.WorkBook = readFile(path)

    const authzConfig = parse(workbook, config.excelConfig, config.transformOptions)

    fs.writeFileSync(out, JSON.stringify(authzConfig, null, 4))
}