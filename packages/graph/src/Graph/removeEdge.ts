import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeType } from "./types"
import { batch } from "./batch"
import { unsetInGraph } from "./internals/core"
import { parseNodeIdentifier } from "./internals/parseNodeIdentifier"

export function removeEdge<
    N extends Node,
    E extends Edges<N>,
    N1 extends keyof Bimap<E> & NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    source: NodeIdentifier<N, N1>,
    target: NodeIdentifier<N, N2>,
): Graph<N, E> {
    const [sourceType, sourceId] = parseNodeIdentifier(source)
    const [targetType, targetId] = parseNodeIdentifier(target)

    return batch(graph, (graph) => {
        graph = unsetInGraph(graph, ["edges", sourceType, sourceId, targetType, targetId])
        graph = unsetInGraph(graph, ["edges", targetType, targetId, sourceType, sourceId])
        return graph
    })
}
