import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeType } from "./types"
import { getEdge } from "./getEdge"
import { hasEdge } from "./hasEdge"
import { setEdge } from "./setEdge"

export function mapEdge<
    N extends Node,
    E extends Edges<N>,
    N1 extends keyof Bimap<E> & NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    source: NodeIdentifier<N, N1>,
    target: NodeIdentifier<N, N2>,
    update: (edge: NoInfer<Bimap<E>[N1][N2]>) => NoInfer<Bimap<E>[N1][N2]>,
): Graph<N, E> {
    if (!hasEdge(graph, source, target)) return graph
    const before = getEdge(graph, source, target)!
    const after = update(before)
    if (before === after) return graph
    return setEdge(graph, source, target, after as any)
}
