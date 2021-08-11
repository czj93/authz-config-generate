import { TransformPlugin } from './interfaces'

import { ResourcesTree } from '../resources-tree'
import { Transform } from '../transform'
import { AuthConfig, Resource } from '../interfaces/index'
import { Route, RouteItem } from '../routes'

export class ResourcePlugin implements TransformPlugin {

    routeInstance: Route

    constructor(route: Route) {
        this.routeInstance = route
    }

    initRescorces(rescorceTree: ResourcesTree) {

    }

    transformAfter(trasnform: Transform, authConfig: AuthConfig) {
        authConfig.resources.forEach((item: Resource) => {
            const route:RouteItem = this.routeInstance.getRouteByResourceName(item.name)

            if(route) {
                item.displayName = route.routeName
                item.uris = [route.path]

                if(route.parentPath) {
                    item.attributes.parentPath = [ route.parentPath ]
                }
                if(route.hidden) {
                    item.attributes.hiddden = [ route.hidden ]
                }
            }
        })
    }
}