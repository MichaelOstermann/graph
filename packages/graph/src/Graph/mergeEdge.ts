import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeType } from "./types"
import { getEdge } from "./getEdge"
import { hasEdge } from "./hasEdge"
import { setEdge } from "./setEdge"

export function mergeEdge<
    N extends Node,
    E extends Edges<N>,
    N1 extends keyof Bimap<E> & NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    source: NodeIdentifier<N, N1>,
    target: NodeIdentifier<N, N2>,
    update: Partial<Bimap<E>[N1][N2]>,
): Graph<N, E> {
    if (!hasEdge(graph, source, target)) return graph
    const edge = getEdge(graph, source, target)!
    const keys = Object.keys(update) as (keyof typeof update)[]
    if (keys.length === 0) return graph
    const hasChanges = keys.some(k => update[k] !== edge[k])
    return hasChanges ? setEdge(graph, source, target, { ...edge, ...update } as any) : graph
}
