import type { Edges, Graph, Node, NodeIdentifier, NodeOfType, NodeType } from "./types"
import { parseNodeIdentifier } from "./internals/parseNodeIdentifier"

export function getNode<
    N extends Node,
    E extends Edges<N>,
    U extends NodeType<N>,
>(
    graph: Graph<N, E>,
    node: NodeIdentifier<N, U>,
): NodeOfType<N, U> | undefined {
    const [type, id] = parseNodeIdentifier(node)
    return graph.get("nodes")?.get(type)?.get(id)
}
