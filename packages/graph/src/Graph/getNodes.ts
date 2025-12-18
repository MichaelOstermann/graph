import type { Edges, Graph, Node, NodeOfType, NodeType } from "./types"

export function getNodes<
    N extends Node,
    E extends Edges<N>,
    U extends NodeType<N>,
>(
    graph: Graph<N, E>,
    type: U,
): NodeOfType<N, U>[] {
    const nodeMap = graph.get("nodes")?.get(type)
    return nodeMap ? [...nodeMap.values()] : []
}
