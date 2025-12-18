import type { Edges, Graph, Node, NodeIdentifier, NodeType } from "./types"
import { parseNodeIdentifier } from "./internals/parseNodeIdentifier"

export function hasNode<
    N extends Node,
    E extends Edges<N>,
    U extends NodeType<N>,
>(
    graph: Graph<N, E>,
    node: NodeIdentifier<N, U>,
): boolean {
    const [type, id] = parseNodeIdentifier(node)

    return graph
        .get("nodes")
        ?.get(type)
        ?.has(id) ?? false
}
