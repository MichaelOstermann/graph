import type { Edges, Graph, Node } from "./types"

export function batch<N extends Node, E extends Edges<N>>(
    prevGraph: Graph<N, E>,
    transform: (graph: Graph<N, E>) => Graph<N, E> | void,
): Graph<N, E> {
    if (prevGraph.has("clones")) return transform(prevGraph) ?? prevGraph
    const clone = new Map(prevGraph) as Graph<N, E>
    clone.set("clones", new Set([clone]))
    const nextGraph = transform(clone) ?? clone
    if (isEqual(prevGraph, nextGraph)) return prevGraph
    nextGraph.delete("clones")
    return nextGraph
}

function isEqual(
    before: Graph<any, any>,
    after: Graph<any, any>,
): boolean {
    return before.get("nodes") === after.get("nodes")
        && before.get("edges") === after.get("edges")
}
