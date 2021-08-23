
export function vistior(list: [], parent: object, before?: Function, after?: Function) {
    if(list) {
        list.forEach((item: any, index) => {
            before && before(item, parent, index)
            if(item.children) {
                vistior(item.children, item, before, after)
            }
            after && after(item, parent, index)
        })
    }
}