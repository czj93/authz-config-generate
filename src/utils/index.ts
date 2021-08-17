
export function vistior(list, parent, before?: Function, after?: Function) {
    if(list) {
        list.forEach((item, index) => {
            before && before(item, parent, index)
            if(item.children) {
                vistior(item.children, item, before, after)
            }
            after && after(item, parent, index)
        })
    }
}