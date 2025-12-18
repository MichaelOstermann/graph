import type { Edges, Graph, Node, NodeIdentifier, NodeOfType, NodeType } from "./types"
import { batch } from "./batch"
import { getNode } from "./getNode"
import { removeNode } from "./removeNode"
import { setEdge } from "./setEdge"
import { setNode } from "./setNode"

export function mapNode<
    N extends Node,
    E extends Edges<N>,
    U extends NodeType<N>,
>(
    graph: Graph<N, E>,
    node: NodeIdentifier<N, U>,
    update: (node: NoInfer<NodeOfType<N, U>>) => NoInfer<NodeOfType<N, U>>,
): Graph<N, E> {
    const prev = getNode(graph, node)
    if (!prev) return graph
    const next = update(prev)
    if (prev === next) return graph
    if (prev.id === next.id && prev.type === next.type) return setNode(graph, next)
    return batch(graph, (graph) => {
        graph = setNode(graph, next)
        const edges = graph.get("edges")
        for (const [targetType, targetIds] of edges?.get(prev.type)?.get(prev.id) ?? []) {
            for (const [targetId, targetData] of targetIds) {
                graph = setEdge(graph, [next.type, next.id], [targetType, targetId], targetData as any)
            }
        }
        graph = removeNode(graph, prev)
        return graph
    })
}
