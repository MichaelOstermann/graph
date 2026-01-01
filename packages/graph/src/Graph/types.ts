import type { NodeTypesMap, SourceTypesMap } from "./internals/types"

export type NodeId = PropertyKey
export type Node = { id: NodeId, type: string }
export type NodeType<T extends Node> = T["type"]
export type NodeOfType<T extends Node, U extends NodeType<T>> = Extract<T, { type: U }>
export type NodeIdentifier<T extends Node, U extends NodeType<T>> =
    | { id: Extract<T, { type: U }>["id"], type: U }
    | [U, id: Extract<T, { type: U }>["id"]]
export type Edge = Record<string, unknown> | void
export type Edges<N extends Node> = Partial<Record<NodeType<N>, Partial<Record<NodeType<N>, Edge>>>>

export interface Graph<N extends Node, _E extends Edges<N>> extends Map<"nodes" | "edges" | "clones", NodeTypesMap<N> | SourceTypesMap | Set<any>> {
    delete: (key: "clones") => boolean
    get: ((key: "nodes") => NodeTypesMap<N> | undefined) & ((key: "edges") => SourceTypesMap | undefined) & ((key: "clones") => Set<any> | undefined)
    set: (key: "clones", value: Set<any>) => this
}
