import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeOfType, NodeType } from "./types"
import { getNode } from "./getNode"

export function getNeighbors<
    N extends Node,
    E extends Edges<N>,
    N1 extends NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    node: NodeIdentifier<N, N1>,
    type: N2,
): NodeOfType<N, N2>[] {
    const result: NodeOfType<N, N2>[] = []
    const sourceNode = getNode(graph, node)
    if (!sourceNode) return result

    const nodeMap = graph.get("nodes")?.get(type)
    if (!nodeMap) return result

    for (const targetId of graph.get("edges")?.get(sourceNode.type)?.get(sourceNode.id)?.get(type)?.keys() ?? []) {
        const targetNode = nodeMap.get(targetId)!
        result.push(targetNode)
    }
    return result
}
