import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeOfType, NodeType } from "./types"
import { getNode } from "./getNode"

export function forEachNeighbor<
    N extends Node,
    E extends Edges<N>,
    N1 extends NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    node: NodeIdentifier<N, N1>,
    type: N2,
    fn: (
        target: NoInfer<NodeOfType<N, N2>>,
        edge: NoInfer<Bimap<E>[N1][N2]>,
        source: NoInfer<NodeOfType<N, N1>>,
    ) => void,
): Graph<N, E> {
    const sourceNode = getNode(graph, node)
    if (!sourceNode) return graph

    const nodeMap = graph.get("nodes")?.get(type)
    if (!nodeMap) return graph

    for (const [targetId, edge] of graph.get("edges")?.get(sourceNode.type)?.get(sourceNode.id)?.get(type) ?? []) {
        const targetNode = nodeMap.get(targetId)!
        fn(targetNode, edge as any, sourceNode)
    }
    return graph
}
