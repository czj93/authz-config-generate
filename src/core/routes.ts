
export type RouteItem = {
    resourceName: string
    routeName: string
    path: string
    parentPath?: string
    hidden?: string
}

export type RouteList = Array<RouteItem>

export class Route {

    list: RouteList

    routeMap: Object = {}

    constructor(routes: RouteList) {
        this.list = routes

        this.initMap(routes)
    }


    initMap(routes) {
        routes.forEach((item: RouteItem) => {
            if(this.routeMap[item.resourceName]) {
                console.log(`${item.resourceName} 菜单路由重复`)
            }
            this.routeMap[item.resourceName] = item
        })
    }

    getRouteByResourceName(resourceName: string) {
        if(this.routeMap[resourceName]) return this.routeMap[resourceName]
        console.log(`${resourceName}菜单路由不存在`)
    }

}