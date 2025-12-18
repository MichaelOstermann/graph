import type { Edges, Graph, Node, NodeOfType, NodeType } from "./types"

export function forEachNode<
    N extends Node,
    E extends Edges<N>,
    U extends NodeType<N>,
>(
    graph: Graph<N, E>,
    type: U,
    fn: (node: NoInfer<NodeOfType<N, U>>) => void,
): Graph<N, E> {
    for (const node of graph.get("nodes")?.get(type)?.values() ?? [])
        fn(node)
    return graph
}
