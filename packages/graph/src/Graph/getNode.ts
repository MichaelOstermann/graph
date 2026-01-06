import type { Edges, Graph, Node, NodeIdentifier, NodeOfType, NodeType } from "./types"
import { parseNodeIdentifier } from "./internals/parseNodeIdentifier"

/**
 * # getNode
 *
 * ```ts
 * function Graph.getNode(
 *     graph: Graph,
 *     node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
 * ): Node | undefined
 * ```
 *
 * Retrieves a node from the graph. Returns `undefined` if the node doesn't exist.
 *
 * ## Example
 *
 * ```ts
 * import { Graph } from "@monstermann/graph";
 *
 * type Nodes =
 *     | { type: "Task"; id: string; title: string }
 *     | { type: "Section"; id: string }
 *     | { type: "Project"; id: string };
 *
 * type Edges = {
 *     Project: { Task: void };
 *     Section: { Task: void };
 * };
 *
 * const graph = Graph.create<Nodes, Edges>();
 * const withNode = Graph.setNode(graph, {
 *     type: "Task",
 *     id: "1",
 *     title: "My Task",
 * });
 *
 * const task = Graph.getNode(withNode, ["Task", "1"]);
 * // task: { type: "Task", id: "1", title: "My Task" }
 *
 * const missing = Graph.getNode(withNode, ["Task", "2"]);
 * // missing: undefined
 * ```
 *
 */
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
