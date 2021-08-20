import { v4 as uuidv4 } from 'uuid'
import { vistior } from '../utils/index'
import { ResourcesTree, Resources, ResourceType, ResourceItem } from './resources-tree'
import {
    AuthConfig, PolicyEnforcementMode, Resource, PolicieType, Policie, ResourceScope,
    Scope, DecisionStrategy, ResourceAttribute, PolicieLogic, PolicieConfig,
} from './interfaces/index' 

import { TransformPlugin } from './plugins/interfaces'

export type TransformOptions = {
    clientId: string,
    scopeProps?: object,
    plugins?: Array<TransformPlugin>
}

const defaultScopeProps = {
    '新建': 'create',
    '查看': 'view',
    '删除': 'del',
    '修改': 'edit',
}

// 页面查看按钮名称
const VIEW_BTN_NAME = '查看'

enum PermissionProps {
    RESOURCE = 'resourcePermissions',
    SCOPE = 'scopePermissions'
}

export class Transform {

    private options: TransformOptions

    private plugins: Array<TransformPlugin>

    private resources: Resources

    private scopes: Array<Scope> = []

    private scopePropsMap: { [key: string]: any } = {}

    private rolePolicies: Array<Policie> = []

    private resourcePermissions: Array<Policie> = []

    private scopePermissions: Array<Policie> = []

    constructor(resources: ResourcesTree, options: TransformOptions) {
        
        this.options = options
        this.plugins = options.plugins || []
        this.scopePropsMap = options.scopeProps || defaultScopeProps

        this.plugins.forEach(instance => instance.initRescorces(resources))
        this.resources = resources.getResources()
        
        this.init(resources)
    }

    init(resources: ResourcesTree) {
        this.initRoles(resources.getRoles())
    }

    // 生成角色策略
    initRoles(roles: Array<string>) {
        this.rolePolicies = roles.map(role => {
            const roleObj = {
                id: `${this.options.clientId}/${role}`,
                required: false,
            }
            return {
                id: uuidv4(),
                name: role,
                type: PolicieType.ROLE,
                logic: PolicieLogic.POSITIVE,
                decisionStrategy: DecisionStrategy.UNANIMOUS,
                config: {
                    roles: JSON.stringify([roleObj])
                }
            }
        })
    }

    // 遍历菜单tree 生成 资源、权限
    resourceTransform(): Array<Resource> {
        const resources: Array<Resource> = []
        vistior(this.resources, null, (item: ResourceItem, parent: ResourceItem, index: number) => {
            if(item.type === ResourceType.Menu) {
                const sort = this.createSort(parent, index+1)
                if(item) item.sort = sort
                const attributes: ResourceAttribute = {
                    sort: [sort]
                }
                const scopes: Array<ResourceScope> = []
                if (item.children && item.children.length) {
                    const btns: Array<ResourceItem> = item.children.filter(item => item.type === ResourceType.Btn)
                    if(btns) {
                        btns.forEach(btn => {
                            this.addScope(item, btn)
                            this.createPermission(item, btn)
                            const scopeName = this.getScopeProp(btn.name)
                            if(btn.name !== VIEW_BTN_NAME && scopeName && !scopes.find(scope => scope.name === scopeName)) {
                                scopes.push({
                                    name: scopeName
                                })
                            }
                        })
                    }
                } else {
                    // 没有按钮的叶菜单添加权限
                    if(item.roles) {
                        item.menuLeaf = true
                        this.addPermisssion(PermissionProps.RESOURCE, this.createResourcePermission(item))
                        // 给父级添加可访问的 角色
                        this.parentAddRoles(item, parent)
                    }
                }
                
                let res: Resource = {
                    _id: uuidv4(),
                    name: item.name,
                    displayName: '',
                    uris: [],
                    ownerManagedAccess: false,
                    attributes,
                }

                if(scopes && scopes.length) {
                    res.scopes = scopes
                }

                resources.push(res)
            }

        }, (item: ResourceItem, parent: ResourceItem) => {
            // 给父级菜单添加权限
            if(item.type === ResourceType.Menu) {
                this.parentAddRoles(item, parent)
                // 跳过带有查看按钮的的页面 避免重复创建权限
                const flag = item.children && item.children.some(item => item.type === ResourceType.Btn && item.name === VIEW_BTN_NAME)
                if(!item.menuLeaf && !flag) {
                    this.addPermisssion(PermissionProps.RESOURCE, this.createResourcePermission(item))
                }
            }
        })

        return resources
    }

    parentAddRoles(item: ResourceItem, parent: ResourceItem) {
        if(parent) {
            if(!parent.roles) parent.roles = []
            if(item.roles) {
                item.roles.forEach(role => {
                    if(parent.roles && !parent.roles.includes(role)) {
                        parent.roles.push(role)
                    }
                })
            }
        }
    }

    // 生成菜单排序
    createSort(parent: ResourceItem, index: number): string {
        if(!parent) {
            return ''+index
        }
        return parent.sort + ( index > 9 ? '' + index : '0' + index )
    }

    getScopeProp(btnName: string) {
        return this.scopePropsMap[btnName] || btnName
    }

    addScope(resource: ResourceItem, btn: ResourceItem) {
        // btn.roles
        if(!this.scopes.find(item => item.displayName === btn.name) && btn.name !== VIEW_BTN_NAME) {
            this.scopes.push({
                id: uuidv4(),
                name: this.getScopeProp(btn.name),
                displayName: btn.name,
            })
        }
    }

    createPermission(resource: ResourceItem, btn: ResourceItem) {
        if(btn.name === VIEW_BTN_NAME) {
            this.addPermisssion(PermissionProps.RESOURCE, this.createResourcePermission(resource, btn))
            // this.resourcePermissions.push(this.createResourcePermission(resource, btn))
        } else {
            this.addPermisssion(PermissionProps.SCOPE, this.createScopePermission(resource, btn))
            // this.scopePermissions.push(this.createScopePermission(resource, btn))
        }
    }

    // 添加权限 避免重复添加
    addPermisssion(prop: PermissionProps, policie: Policie) {
        if(!this[prop].find(item => item.name === policie.name)) {
            this[prop].push(policie)
        } else {
            console.log(`${prop} - ${policie.name} 重复`)
        }
    }

    // 创建资源权限
    createResourcePermission(resource: ResourceItem, btn?: ResourceItem): Policie {
    
      const roles = btn ? btn.roles : resource.roles

      const decisionStrategy = roles && roles.length > 1 
        ? DecisionStrategy.AFFIRMATIVE 
        : DecisionStrategy.UNANIMOUS

        const applyPolicies = JSON.stringify(roles)

        const name = btn ? `${resource.name}-${btn.name}` : `${resource.name}`

      return {
          id: uuidv4(),
          name: name,
          type: PolicieType.RESOURCE,
          logic: PolicieLogic.POSITIVE,
          decisionStrategy,
          config: {
            resources: JSON.stringify([ resource.name ]),
            applyPolicies
          }
      }
    }

    // 创建 scope 权限
    createScopePermission(resource: ResourceItem, btn: ResourceItem): Policie {

        const decisionStrategy = btn.roles && btn.roles.length > 1 
        ? DecisionStrategy.AFFIRMATIVE 
        : DecisionStrategy.UNANIMOUS

        const scopes = JSON.stringify([this.getScopeProp(btn.name)])
        const resources = JSON.stringify([resource.name])
        const applyPolicies = JSON.stringify(btn.roles)

        return {
            id: uuidv4(),
            name: `${resource.name}-${btn.name}`,
            description: '',
            type: PolicieType.SCOPE,
            logic: PolicieLogic.POSITIVE,
            decisionStrategy,
            config: {
                scopes,
                resources,
                applyPolicies,
            }
        }
    }

    // 获取所有的策略
    getPolicies(): Array<Policie> {
        return [].concat(this.rolePolicies as [], this.resourcePermissions as [], this.scopePermissions as [])
    }

    transform(): AuthConfig {
        let resources: Array<Resource> = this.resourceTransform()

        const authConfig: AuthConfig = {
            allowRemoteResourceManagement: true,
            policyEnforcementMode: PolicyEnforcementMode.ENFORCING,
            resources: resources,
            policies: this.getPolicies(),
            scopes: this.scopes,
            decisionStrategy: DecisionStrategy.UNANIMOUS
        }

        this.plugins.forEach(instance => instance.transformAfter(this, authConfig))

        return authConfig
    }

}