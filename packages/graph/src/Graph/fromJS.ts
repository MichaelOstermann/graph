import type { Edges, Graph, Node, NodeId } from "./types"
import { batch } from "./batch"
import { create } from "./create"
import { setEdge } from "./setEdge"
import { setNode } from "./setNode"

export function fromJS<
    N extends Node,
    E extends Edges<N>,
>(data: {
    edges: [string, NodeId, string, NodeId, unknown][]
    nodes: Node[]
}): Graph<N, E> {
    return batch(create<N, E>(), (graph) => {
        for (const node of data.nodes as any)
            graph = setNode(graph, node)

        for (const [sourceType, sourceId, targetType, targetId, edge] of data.edges as any)
            graph = setEdge(graph, [sourceType, sourceId], [targetType, targetId], edge)

        return graph
    })
}
