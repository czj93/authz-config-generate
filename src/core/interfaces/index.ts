type uuid = string

type DecisionStrategy = 'UNANIMOUS' | 'AFFIRMATIVE'

type ResourceAttribute = {
    sort?: Array<string>
    redirect?: Array<string>
    hiddden?: Array<string>
    parentPath?: Array<string>
}

type ResourceScope = {
    name: string
}

interface Resource {
    _id: uuid,
    name: string
    uris: Array<string>
    displayName: string
    scopes?: Array<ResourceScope>
    ownerManagedAccess: boolean
    attributes: Array<ResourceAttribute>
}

type PolicieType = 'role' | 'resource' | 'scope'

type PolicieLogic = 'POSITIVE'

type PolicieRole = {
    id: string
    required: boolean
}

interface Policie {
    id: uuid
    name: string
    description: string,
    type: PolicieType,
    logic: PolicieLogic,
    decisionStrategy: DecisionStrategy,
    config: PolicieConfig
}


type PolicieConfig = NormalPolicieConfig | PermissionConfig | ScopePermissionConfig

type NormalPolicieConfig = {
    roles?: Array<PolicieRole>
}

type PermissionConfig = {
    // [ Policie.name ]
    applyPolicies?: Array<string>
}

type ResourcePermissionConfig = PermissionConfig & {
    defaultResourceType?: string,
}

type ScopePermissionConfig = PermissionConfig & {
    scopes?: Array<string>
    resources?: Array<string>
}

interface Scope {
    id: uuid
    name: string,
    displayName?: string
}

type PolicyEnforcementMode = 'ENFORCING'

interface AuthConfig {
    allowRemoteResourceManagement: boolean
    policyEnforcementMode: PolicyEnforcementMode
    resources: Array<Resource>
    policies: Array<Policie>
    scopes: Array<Scope>
    decisionStrategy: DecisionStrategy
}
