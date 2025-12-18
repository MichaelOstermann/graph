import type { Edges, Graph, Node, NodeIdentifier, NodeType } from "./types"
import { batch } from "./batch"
import { unsetInGraph } from "./internals/core"
import { parseNodeIdentifier } from "./internals/parseNodeIdentifier"

export function removeNode<
    N extends Node,
    E extends Edges<N>,
    U extends NodeType<N>,
>(
    graph: Graph<N, E>,
    node: NodeIdentifier<N, U>,
): Graph<N, E> {
    const [sourceType, sourceId] = parseNodeIdentifier(node)
    return batch(graph, (graph) => {
        for (const [targetType, targets] of graph.get("edges")?.get(sourceType)?.get(sourceId) ?? []) {
            for (const targetId of targets.keys()) {
                graph = unsetInGraph(graph, ["edges", targetType, targetId, sourceType, sourceId])
            }
        }
        graph = unsetInGraph(graph, ["edges", sourceType, sourceId])
        graph = unsetInGraph(graph, ["nodes", sourceType, sourceId])
        return graph
    })
}
