import { ResourcesTree } from '../resources-tree'
import { Transform } from '../transform'
import { AuthConfig } from '../interfaces/index'


export interface TransformPlugin {
    initRescorces(rescorceTree: ResourcesTree): void
    transformAfter(trasnform: Transform, authConfig: AuthConfig): void
}