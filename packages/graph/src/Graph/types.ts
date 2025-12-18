// TODO internal?
export type NodeId = PropertyKey
export type Node = { id: NodeId, type: string }
export type NodeType<T extends Node> = T["type"]
export type NodeOfType<T extends Node, U extends NodeType<T>> = Extract<T, { type: U }> // TODO this used?
// TODO U back to extends
export type NodeIdentifier<T extends Node, U = NodeType<T>> =
    | { id: Extract<T, { type: U }>["id"], type: U }
    | [U, id: Extract<T, { type: U }>["id"]]
export type Edge = Record<string, unknown> | void
export type Edges<N extends Node> = Partial<Record<NodeType<N>, Partial<Record<NodeType<N>, Edge>>>>

// TODO internal
export type SourceTypesMap = ReadonlyMap<any, SourceIdsMap>
export type SourceIdsMap = ReadonlyMap<NodeId, TargetTypesMap>
export type TargetTypesMap = ReadonlyMap<any, TargetIdsMap>
export type TargetIdsMap = ReadonlyMap<NodeId, Edge>

// TODO internal
export type NodeIdsMap<T extends Node, U extends NodeType<T> = NodeType<T>> = ReadonlyMap<NodeId, NodeOfType<T, U>>
export interface NodeTypesMap<T extends Node> extends ReadonlyMap<NodeType<T>, NodeIdsMap<T, NodeType<T>>> {
    get: <V extends NodeType<T>>(type: V) => NodeIdsMap<T, V> | undefined
}

export interface Graph<N extends Node, _E extends Edges<N>> extends Map<"nodes" | "edges" | "clones", NodeTypesMap<N> | SourceTypesMap | Set<any>> {
    delete: (key: "clones") => boolean
    get: ((key: "nodes") => NodeTypesMap<N> | undefined) & ((key: "edges") => SourceTypesMap | undefined) & ((key: "clones") => Set<any> | undefined)
    set: (key: "clones", value: Set<any>) => this
}
