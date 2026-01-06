import type { Edges, Graph, Node } from "./types"
import { setInGraph } from "./internals/core"

/**
 * # setNode
 *
 * ```ts
 * function Graph.setNode(
 *     graph: Graph,
 *     node: Node,
 * ): Graph
 * ```
 *
 * Adds or updates a node in the graph. Returns a new graph instance with the node set.
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
 *
 * // Add a new node
 * const g1 = Graph.setNode(graph, { type: "Task", id: "1", title: "My Task" });
 *
 * // Update existing node
 * const g2 = Graph.setNode(g1, { type: "Task", id: "1", title: "Updated Task" });
 * ```
 *
 */
export function setNode<N extends Node, E extends Edges<N>>(
    graph: Graph<N, E>,
    node: NoInfer<N>,
): Graph<N, E> {
    return setInGraph(graph, ["nodes", node.type, node.id], node)
}
