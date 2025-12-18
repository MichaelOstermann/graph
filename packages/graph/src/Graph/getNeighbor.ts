import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeOfType, NodeType } from "./types"
import { getNode } from "./getNode"

export function getNeighbor<
    N extends Node,
    E extends Edges<N>,
    N1 extends NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    node: NodeIdentifier<N, N1>,
    type: N2,
): NodeOfType<N, N2> | undefined {
    const sourceNode = getNode(graph, node)
    if (!sourceNode) return undefined

    const nodeMap = graph.get("nodes")?.get(type)
    if (!nodeMap) return undefined

    // eslint-disable-next-line no-unreachable-loop
    for (const targetId of graph.get("edges")?.get(sourceNode.type)?.get(sourceNode.id)?.get(type)?.keys() ?? []) {
        return nodeMap.get(targetId)!
    }
    return undefined
}
