type uuid = string

export enum DecisionStrategy {
    UNANIMOUS = "UNANIMOUS",
    AFFIRMATIVE = "AFFIRMATIVE",
    CONSENSUS = "CONSENSUS",
}

export type ResourceAttribute = {
    sort?: Array<string>
    redirect?: Array<string>
    hiddden?: Array<string>
    parentPath?: Array<string>
}

type ResourceScope = {
    name: string
}

export interface Resource {
    _id: uuid,
    name: string
    uris: Array<string>
    displayName: string
    scopes?: Array<ResourceScope>
    ownerManagedAccess: boolean
    attributes: ResourceAttribute
}

export enum PolicieType {
    ROLE = 'role',
    SCOPE = 'scope',
    RESOURCE = 'resource',
}

// type PolicieType = 'role' | 'resource' | 'scope'

export enum PolicieLogic {
    POSITIVE = 'POSITIVE',
    NEGATIVE = 'NEGATIVE',
}

type PolicieRole = {
    id: string
    required: boolean
}

export interface Policie {
    id: uuid
    name: string
    description?: string,
    type: PolicieType,
    logic: PolicieLogic,
    decisionStrategy: DecisionStrategy,
    config: PolicieConfig
}


export type PolicieConfig = NormalPolicieConfig | PermissionConfig | ScopePermissionConfig

type NormalPolicieConfig = {
    roles?: Array<PolicieRole>
}

type PermissionConfig = {
    // [ Policie.name ]
    applyPolicies?: string
}

type ResourcePermissionConfig = PermissionConfig & {
    defaultResourceType?: string,
}

type ScopePermissionConfig = PermissionConfig & {
    scopes?: string
    resources?: string
}

export interface Scope {
    id: uuid
    name: string,
    displayName?: string
}

export enum PolicyEnforcementMode {
    ENFORCING = "ENFORCING"
}
export interface AuthConfig {
    allowRemoteResourceManagement: boolean
    policyEnforcementMode: PolicyEnforcementMode
    resources: Array<Resource>
    policies: Array<Policie>
    scopes: Array<Scope>
    decisionStrategy: DecisionStrategy
}
