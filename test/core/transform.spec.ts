// @ts-nocheck
import { Resources, ResourceType, ResourcesTree } from '../../src/core/resources-tree'
import { Transform, TransformOptions } from '../../src/core/transform'
import { AuthConfig, PolicieType } from '../../src/core/interfaces/index'

import { vistior } from '../../src/utils/'

const menu111 = {
    name: '菜单1-1-1',
    type: ResourceType.Menu,
    children: [
        {
            name: '查看',
            type: ResourceType.Btn,
            roles: ['系统管理员', '运营', '测试']
        },
        {
            name: '删除',
            type: ResourceType.Btn,
            roles: ['系统管理员']
        },
        {
            name: '编辑',
            type: ResourceType.Btn,
            roles: ['系统管理员']
        }
    ]
}

const resourceTree = {
    getResources: function(): Resources {
        return [
            {
                name: '菜单1',
                type: ResourceType.Menu,
                children: [
                    {
                        name: '菜单1-1',
                        type: ResourceType.Menu,
                        children: [
                            menu111,
                            {
                                name: '菜单1-1-2',
                                type: ResourceType.Menu,
                                roles: ['系统管理员', '运营', '测试']
                            }
                        ]
                    }
                ]
            },
            {
                name: '菜单2',
                type: ResourceType.Menu,
                children: [
                    {
                        name: '菜单2-1',
                        type: ResourceType.Menu,
                        children: [
                            {
                                name: '菜单2-1-1',
                                type: ResourceType.Menu,
                                roles: ['系统管理员', '运营']
                            }
                        ]
                    }
                ]
            },
            {
                name: '菜单3',
                type: ResourceType.Menu,
                children: [
                    {
                        name: '菜单3-1',
                        type: ResourceType.Menu,
                        roles: ['系统管理员']
                    }
                ]
            }
        ]
    },
    getRoles: function() {
        return ['系统管理员', '运营', '测试']
    }
}

describe('core transform test', () => {
    let authzConfig: AuthConfig
    let resources: Resources
    let resourceCount = 0
    let scopePermissionCount = 0

    const roles = []
    const scopes = []
    const config = { clientId: 'test' }

    beforeAll(() => {
        resources = resourceTree.getResources()
        authzConfig = new Transform(resourceTree as ResourcesTree, config).transform()

        vistior(resources, null, (item, parent, index) => {
            // 页面个数
            if(item.type === ResourceType.Menu) {
                resourceCount++
            }

            if(item.type === ResourceType.Btn) {
                if(item.name !== '查看') {
                    if(!scopes.includes(item.name)) scopes.push(item.name)
                    scopePermissionCount++
                }
            }
            
            // 角色数量
            if(item.roles) {
                item.roles.forEach(role => {
                    if(!roles.includes(role)) {
                        roles.push(role)
                    }
                })
            }

        })
    })

    test('test resources count', () => {
        expect(authzConfig.resources.length).toBe(resourceCount)
    })

    test('test resource scope', () => {
        const menu111Resources = authzConfig.resources.find(item => item.name === menu111.name)
        const scopes = menu111.children.filter(item => item.name !== '查看')
        expect(menu111Resources.scopes.length).toBe(scopes.length)
    })

    test('test policies count', () => {
        // 策略数量 = 资源数量 + 角色数量 + 页面按钮数量
        const total = resourceCount + scopePermissionCount + roles.length
        expect(authzConfig.policies.length).toBe(total)
    })

    test('test role policie config', () => {
        const rolePolicies = authzConfig.policies.filter(item => item.type === PolicieType.ROLE)

        if(rolePolicies.length) {
            expect(rolePolicies[0].config.roles).toEqual(JSON.stringify([
                {
                    id: `${config.clientId}/${rolePolicies[0].name}`,
                    required: false
                }
            ]))
        }
    })

    test('test scope count',() => {
        expect(authzConfig.scopes.length).toEqual(scopes.length)
    })

    test('test scope', () => {
        expect(authzConfig.scopes.map(item => item.displayName)).toEqual(scopes)
    })

    test(`test ${menu111.name} resource permission`, () => {
        const permission = authzConfig.policies.find(item => item.name === `${menu111.name}-查看`)
        const viewBtn = menu111.children.find(item => item.name === '查看')
        expect(permission).toBeTruthy()
        expect(permission.type).toEqual(PolicieType.RESOURCE)
        expect(permission.config.resources).toEqual(JSON.stringify([menu111.name]))
        expect(permission.config.applyPolicies).toEqual(JSON.stringify(viewBtn.roles))
    })

    test(`test ${menu111.name} 删除 permission`, () => {
        const delBtn = menu111.children.find(item => item.name === '删除')
        const permission = authzConfig.policies.find(item => item.name === `${menu111.name}-删除`)

        expect(permission).toBeTruthy()
        expect(permission.type).toEqual(PolicieType.SCOPE)
        expect(JSON.parse(permission.config.scopes).length).toEqual(1)
        expect(permission.config.resources).toEqual(JSON.stringify([menu111.name]))
        expect(permission.config.applyPolicies).toEqual(JSON.stringify(delBtn.roles))
    })
})