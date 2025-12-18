import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeType } from "./types"
import { batch } from "./batch"
import { hasNode } from "./hasNode"
import { setInGraph } from "./internals/core"
import { parseNodeIdentifier } from "./internals/parseNodeIdentifier"

export function setEdge<
    N extends Node,
    E extends Edges<N>,
    N1 extends keyof Bimap<E> & NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    source: NodeIdentifier<N, N1>,
    target: NodeIdentifier<N, N2>,
    ...args: Bimap<E>[N1][N2] extends void ? [] | [data: void] : [data: Bimap<E>[N1][N2]]
): Graph<N, E> {
    const edge = args[0] as Bimap<E>[N1][N2]
    const [sourceType, sourceId] = parseNodeIdentifier(source)
    const [targetType, targetId] = parseNodeIdentifier(target)

    if (!hasNode(graph, source)) return graph
    if (!hasNode(graph, target)) return graph

    return batch(graph, (graph) => {
        graph = setInGraph(graph, ["edges", sourceType, sourceId, targetType, targetId], edge)
        graph = setInGraph(graph, ["edges", targetType, targetId, sourceType, sourceId], edge)
        return graph
    })
}
