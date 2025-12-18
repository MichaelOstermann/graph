import type { Edges, Graph, Node } from "./types"
import { setInGraph } from "./internals/core"

export function setNode<N extends Node, E extends Edges<N>>(
    graph: Graph<N, E>,
    node: NoInfer<N>,
): Graph<N, E> {
    return setInGraph(graph, ["nodes", node.type, node.id], node)
}
