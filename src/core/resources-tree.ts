
export enum ResourceType {
    Menu,
    Btn,
}

type ResourceItem = {
    name: string
    type: ResourceType
    roles?: Array<object>
    parent: ResourceItem | null
    children?: Array<ResourceItem>
}
type ResourcesTreeOption = {
    menuRow: number,
    menuCol: number,
    menuRowCount: number,
    menuColCount: number,
}


export class ResourcesTree {

    private options: ResourcesTreeOption

    private tables: Array<any>

    private current: ResourceItem

    private list: Array<ResourceItem>

    constructor(tables, options: ResourcesTreeOption) {

        this.options = options

        this.tables = tables

        this.list = this.parseMatri(this.getMatri())
    }

    resourceFactory(resourceName, type: ResourceType): ResourceItem {
        return {
            name: resourceName,
            type: type,
            roles: [],
            parent: null,
            children: [],
        }
    }

    append(resourceName: string, type: ResourceType) {
        const item: ResourceItem = this.resourceFactory(resourceName, type)
        item.parent = null
        this.list.push(item)
        this.current = item
    }

    appendChild(resourceName: string, type: ResourceType) {
        const item: ResourceItem = this.resourceFactory(resourceName, type)
        item.parent = this.current
        this.current.children.push(item)
        this.current = item
    }

    addRole(role) {
        if(this.current) {
            this.current.roles.push(role)
        }
    }

    getMatri() {
        const list = []
        const { menuCol, menuRow, menuRowCount, menuColCount } = this.options
        const rowEnd = menuRow + menuRowCount
        const colEnd = menuCol + menuColCount
        this.tables.forEach((row, index) => {
            if(index >= menuRow && index < rowEnd) {
                list.push(row.slice(menuCol, colEnd))
            }
        })
        return list
    }

    getRowCount(matri, start) {
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

    getChildMatri(matri, start, rowCount) {
        const list = []
        const end = start + rowCount
        matri.forEach((rows, index) => {
            if(index >= start && index < end) {
                list.push(rows.slice(1))
            }
        })
        return list
    }

    parseMatri (matri) {
        return matri.map((rows, index) => {
            const cell = rows[0]
            if(!cell) {
                return null
            }
            
            const rowCount = this.getRowCount(matri, index)
            const childMatri = this.getChildMatri(matri, index, rowCount)
            const children = childMatri.length && childMatri[0].length ? this.parseMatri(childMatri) : null
    
            return {
                name: cell,
                children: children
            }
        }).filter(item => item)
    }
}
