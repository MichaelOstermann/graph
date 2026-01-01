import type { Edge, Node, NodeId, NodeOfType, NodeType } from "../types"

type GetAllTargets<E> = E extends Record<string, infer V>
    ? V extends Record<string, any>
        ? keyof V
        : never
    : never

type GetReverseMappings<E, Target> = {
    [K in keyof E as Target extends keyof E[K] ? K : never]: E[K][Target & keyof E[K]]
}

export type Bimap<E> = {
    [K in keyof E | GetAllTargets<E>]:
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    (K extends keyof E ? E[K] : {})
    & GetReverseMappings<E, K>
}

export type SourceTypesMap = ReadonlyMap<any, SourceIdsMap>
export type SourceIdsMap = ReadonlyMap<NodeId, TargetTypesMap>
export type TargetTypesMap = ReadonlyMap<any, TargetIdsMap>
export type TargetIdsMap = ReadonlyMap<NodeId, Edge>

export type NodeIdsMap<T extends Node, U extends NodeType<T> = NodeType<T>> = ReadonlyMap<NodeId, NodeOfType<T, U>>
export interface NodeTypesMap<T extends Node> extends ReadonlyMap<NodeType<T>, NodeIdsMap<T, NodeType<T>>> {
    get: <V extends NodeType<T>>(type: V) => NodeIdsMap<T, V> | undefined
}
