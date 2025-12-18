import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeType } from "./types"
import { parseNodeIdentifier } from "./internals/parseNodeIdentifier"

export function findEdge<
    N extends Node,
    E extends Edges<N>,
    N1 extends keyof Bimap<E> & NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
    E2 extends Bimap<E>[N1][N2],
>(
    graph: Graph<N, E>,
    source: NodeIdentifier<N, N1>,
    type: N2,
    find: (edge: NoInfer<Bimap<E>[N1][N2]>) => edge is E2,
): E2 | undefined

export function findEdge<
    N extends Node,
    E extends Edges<N>,
    N1 extends keyof Bimap<E> & NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    source: NodeIdentifier<N, N1>,
    type: N2,
    find: (edge: NoInfer<Bimap<E>[N1][N2]>) => boolean,
): Bimap<E>[N1][N2] | undefined

export function findEdge<
    N extends Node,
    E extends Edges<N>,
    N1 extends keyof Bimap<E> & NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    source: NodeIdentifier<N, N1>,
    type: N2,
    find: (edge: NoInfer<Bimap<E>[N1][N2]>) => boolean,
): Bimap<E>[N1][N2] | undefined {
    const [sourceType, sourceId] = parseNodeIdentifier(source)
    for (const edge of graph.get("edges")?.get(sourceType)?.get(sourceId)?.get(type)?.values() ?? []) {
        if (find(edge as any)) return edge as any
    }
    return undefined
}
