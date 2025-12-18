import type { Edges, Graph, Node, NodeIdentifier, NodeOfType, NodeType } from "./types"
import { mapNode } from "./mapNode"

export function mergeNode<
    N extends Node,
    E extends Edges<N>,
    U extends NodeType<N>,
>(
    graph: Graph<N, E>,
    node: NodeIdentifier<N, U>,
    update: Partial<NodeOfType<N, U>>,
): Graph<N, E> {
    return mapNode(graph, node, (node) => {
        const keys = Object.keys(update) as (keyof typeof update)[]
        if (keys.length === 0) return node
        const hasChanges = keys.some(k => update[k] !== node[k])
        return hasChanges ? { ...node, ...update } : node
    })
}
