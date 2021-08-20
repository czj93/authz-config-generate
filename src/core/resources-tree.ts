import { SheetJson } from './interfaces/index'

export enum ResourceType {
    Menu,
    Btn,
}

export type ResourceItem = {
    name: string
    sort?: string
    type: ResourceType
    roles?: Array<string>
    parent?: ResourceItem | null
    children?: Array<ResourceItem>
    menuLeaf?: boolean
}

export type ResourcesTreeOption = {
    menuRow: number,
    menuCol: number,
    menuRowCount: number,
    menuColCount: number,
    rolesHeader: {
        row: number,
        col: number,
        rowCount: number,
        colCount: number
    },
    btnRow: number,
    btnCol: number,
}

type BasePos = {
    row: number,
    col: number
}

export type Resources = Array<ResourceItem>
export class ResourcesTree {

    private roles: Array<string>

    private options: ResourcesTreeOption

    private tables: SheetJson

    private list: Resources

    constructor(tables: SheetJson, options: ResourcesTreeOption) {

        this.options = options

        this.tables = tables
        
        this.roles = this.initRoles(tables, options)

        this.list = this.parseMatri(this.getMatri(), {
            row: options.menuRow,
            col: options.menuCol
        })
    }

    getRoles(): Array<string> {
        return this.roles
    }

    getResources(): Resources {
        return this.list
    }

    initRoles(tables: SheetJson, options: ResourcesTreeOption) {
        const list: Array<string> = []
        const {rolesHeader: { row, col, rowCount, colCount }} = options

        for(let i = row, rl = row + rowCount; i < rl; i++){
            for(let n = col, cl = col + colCount; n < cl; n++) {
                const role = tables[i][n]
                if(role) {
                    list.push(role)
                }
            }
        }

        return list
    }

    getMatri() {
        const list: SheetJson = []
        const { menuCol, menuRow, menuRowCount, menuColCount } = this.options
        const rowEnd = menuRow + menuRowCount
        const colEnd = menuCol + menuColCount
        this.tables.forEach((row, index) => {
            if(index >= menuRow && index < rowEnd) {
                list.push(row.slice(menuCol, colEnd) as [])
            }
        })
        return list
    }

    getRowCount(matri: SheetJson, start: number) {
        let rows = 1
        for(let i = start+1; i < matri.length; i++) {
            let cell = matri[i][0]
            if(cell) {
                return rows
            } else {
                rows++
            }
        }
        return rows
    }

    getChildMatri(matri: SheetJson, start: number, rowCount: number, offset = 0) {
        const list: SheetJson = []
        const end = start + rowCount
        matri.forEach((rows, index) => {
            if(index >= start && index < end) {
                list.push(rows.slice(1 + offset) as [])
            }
        })
        return list
    }
    // todo 多级合并单元按钮结构还有问题 offset 要自适应
    parseMatri (matri: SheetJson, basePos: BasePos): Array<ResourceItem> {
        return matri.map((rows, index) => {
            let offset = 0
            let cell = rows[0]
            if(!cell) {
                if(rows[rows.length - 1] && index === 0) {
                    offset = rows.length - 1
                    cell = rows[offset]
                } else {
                    return null
                }
            }
            
            const rowCount = this.getRowCount(matri, index)
            const childMatri = this.getChildMatri(matri, index, rowCount)
            const children: Array<ResourceItem> | null  = 
                childMatri.length && childMatri[0].length 
                ? this.parseMatri(childMatri, { row: basePos.row + index, col: basePos.col + 1 })
                : null
            
            const result:any = {}
            // 叶节点
            if(!children || !children.length) {
                const roles = this.getPermisssionRoles({ row: basePos.row + index, col: basePos.col })
                if(roles) result.roles = roles
            }

            const type = !!offset || basePos.col === this.options.btnCol ? ResourceType.Btn : ResourceType.Menu

            if(offset) return children

            return {
                type: type,
                ...result,
                name: cell,
                children: children && children.length 
                    ? Array.isArray(children[0]) ? children[0] : children
                    : null 
            }
        }).filter(item => item)
    }

    getPermisssionRoles(pos: BasePos) {
        const { rolesHeader: { col } } = this.options
        const permisssions = this.tables[pos.row].slice(col)
        return permisssions.map((v, index) => v ? this.roles[index] : null).filter(item => item)
    }
}
