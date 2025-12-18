import type { Edges, Graph, Node, NodeOfType, NodeType } from "./types"

export function findNode<
    N extends Node,
    E extends Edges<N>,
    U extends NodeType<N>,
    V extends NodeOfType<N, U>,
>(
    graph: Graph<N, E>,
    type: U,
    find: (node: NoInfer<NodeOfType<N, U>>) => node is V,
): V | undefined

export function findNode<
    N extends Node,
    E extends Edges<N>,
    U extends NodeType<N>,
>(
    graph: Graph<N, E>,
    type: U,
    find: (node: NoInfer<NodeOfType<N, U>>) => boolean,
): NodeOfType<N, U> | undefined

export function findNode<
    N extends Node,
    E extends Edges<N>,
    U extends NodeType<N>,
>(
    graph: Graph<N, E>,
    type: U,
    find: (node: NoInfer<NodeOfType<N, U>>) => boolean,
): NodeOfType<N, U> | undefined {
    for (const node of graph.get("nodes")?.get(type)?.values() ?? []) {
        if (find(node)) return node
    }
    return undefined
}
