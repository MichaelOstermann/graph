import type { Edges, Graph, Node, NodeOfType, NodeType } from "./types"

export function findNodes<
    N extends Node,
    E extends Edges<N>,
    U extends NodeType<N>,
    V extends NodeOfType<N, U>,
>(
    graph: Graph<N, E>,
    type: U,
    find: (node: NoInfer<NodeOfType<N, U>>) => node is V,
): V[]

export function findNodes<
    N extends Node,
    E extends Edges<N>,
    U extends NodeType<N>,
>(
    graph: Graph<N, E>,
    type: U,
    find: (node: NoInfer<NodeOfType<N, U>>) => boolean,
): NodeOfType<N, U>[]

export function findNodes<
    N extends Node,
    E extends Edges<N>,
    U extends NodeType<N>,
>(
    graph: Graph<N, E>,
    type: U,
    find: (node: NoInfer<NodeOfType<N, U>>) => boolean,
): NodeOfType<N, U>[] {
    const result: NodeOfType<N, U>[] = []
    for (const node of graph.get("nodes")?.get(type)?.values() ?? []) {
        if (find(node)) result.push(node)
    }
    return result
}
