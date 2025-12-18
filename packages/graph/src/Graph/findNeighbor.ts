import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeOfType, NodeType } from "./types"
import { getNode } from "./getNode"

export function findNeighbor<
    N extends Node,
    E extends Edges<N>,
    N1 extends NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
    N3 extends NodeOfType<N, N2>,
>(
    graph: Graph<N, E>,
    node: NodeIdentifier<N, N1>,
    type: N2,
    find: (
        target: NoInfer<NodeOfType<N, N2>>,
        edge: NoInfer<Bimap<E>[N1][N2]>,
        source: NoInfer<NodeOfType<N, N1>>,
    ) => target is N3,
): N3 | undefined

export function findNeighbor<
    N extends Node,
    E extends Edges<N>,
    N1 extends NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    node: NodeIdentifier<N, N1>,
    type: N2,
    find: (
        target: NoInfer<NodeOfType<N, N2>>,
        edge: NoInfer<Bimap<E>[N1][N2]>,
        source: NoInfer<NodeOfType<N, N1>>,
    ) => boolean,
): NodeOfType<N, N2> | undefined

export function findNeighbor<
    N extends Node,
    E extends Edges<N>,
    N1 extends NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    node: NodeIdentifier<N, N1>,
    type: N2,
    find: (
        target: NoInfer<NodeOfType<N, N2>>,
        edge: NoInfer<Bimap<E>[N1][N2]>,
        source: NoInfer<NodeOfType<N, N1>>,
    ) => boolean,
): NodeOfType<N, N2> | undefined {
    const sourceNode = getNode(graph, node)
    if (!sourceNode) return undefined

    const nodeMap = graph.get("nodes")?.get(type)
    if (!nodeMap) return undefined

    for (const [targetId, edge] of graph.get("edges")?.get(sourceNode.type)?.get(sourceNode.id)?.get(type) ?? []) {
        const targetNode = nodeMap.get(targetId)!
        if (find(targetNode, edge as any, sourceNode)) return targetNode
    }
    return undefined
}
