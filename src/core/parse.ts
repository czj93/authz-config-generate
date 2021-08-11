const fs = require('fs')
const path = require('path')
import XLSX, { readFile, utils } from 'xlsx'

import { Route, RouteList } from './routes'
import { AuthConfig } from './interfaces/index' 
import { Transform, TransformOptions } from './transform'
import { ResourcesTree, ResourcesTreeOption } from './resources-tree'
import { ResourcePlugin } from './plugins/resource-plugin'

export function readXlsx (path, outDir?: string, config?) {
    const out = outDir || './authz.config.json'
    let workbook: XLSX.WorkBook = readFile(path)

    const authzConfig = parse(workbook, config.excelConfig, config.transformOptions)

    fs.writeFileSync(out, JSON.stringify(authzConfig, null, 4))
}

export function parse(
    workbook: XLSX.WorkBook,
    excelConfig: ResourcesTreeOption,
    transformOptions: TransformOptions,
): AuthConfig {
    const sheetNames = ['权限配置', '路由配置', '按钮配置']
    // let sheetNames = workbook.SheetNames
    
    const resourceTree: ResourcesTree = parsePermissionSheet(workbook.Sheets[sheetNames[0]], excelConfig)
    
    const resourcePlugin: ResourcePlugin = parseRouteSheet(workbook.Sheets[sheetNames[1]])

    const scopeProps = parseScopeSheet(workbook.Sheets[sheetNames[2]])

    transformOptions.scopeProps = scopeProps
    transformOptions.plugins = [resourcePlugin]

    const authzConfig = new Transform(resourceTree, transformOptions).transform()

    return authzConfig
}


const parsePermissionSheet = (sheet: XLSX.Sheet, config: ResourcesTreeOption) => {
    const data = utils.sheet_to_json(sheet, { header: 1 })
    fillTables(data)
    const resourcesTree = new ResourcesTree(data, config)
    return resourcesTree
}

const parseRouteSheet = (sheet: XLSX.Sheet): ResourcePlugin => {
    const data:RouteList = utils.sheet_to_json(sheet)
    const routes = new Route(data)


    return new ResourcePlugin(routes)
}

type scopeConfig = {
    displayName: string
    scopeName: string
}

const parseScopeSheet = (sheet: XLSX.Sheet): object => {
    const data: Array<scopeConfig> = utils.sheet_to_json(sheet)
    const scopeMap = {}

    data.forEach(item => {
        scopeMap[item.displayName] = item.scopeName
    })
    return scopeMap
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
