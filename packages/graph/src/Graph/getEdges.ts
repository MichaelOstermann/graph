import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeType } from "./types"
import { parseNodeIdentifier } from "./internals/parseNodeIdentifier"

export function getEdges<
    N extends Node,
    E extends Edges<N>,
    N1 extends keyof Bimap<E> & NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    source: NodeIdentifier<N, N1>,
    type: N2,
): Bimap<E>[N1][N2][] {
    const [sourceType, sourceId] = parseNodeIdentifier(source)
    const edgeMap = graph.get("edges")?.get(sourceType)?.get(sourceId)?.get(type)
    return edgeMap ? [...edgeMap.values()] as any : []
}
