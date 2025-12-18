import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeType } from "./types"
import { parseNodeIdentifier } from "./internals/parseNodeIdentifier"

export function forEachEdge<
    N extends Node,
    E extends Edges<N>,
    N1 extends keyof Bimap<E> & NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    source: NodeIdentifier<N, N1>,
    type: N2,
    fn: (edge: NoInfer<Bimap<E>[N1][N2]>) => void,
): Graph<N, E> {
    const [sourceType, sourceId] = parseNodeIdentifier(source)
    for (const edge of graph.get("edges")?.get(sourceType)?.get(sourceId)?.get(type)?.values() ?? [])
        fn(edge as any)
    return graph
}
