import type { Edges, Graph, Node, NodeOfType, NodeType } from "./types"

/**
 * # forEachNode
 *
 * ```ts
 * function Graph.forEachNode(
 *     graph: Graph,
 *     type: NodeType,
 *     fn: (node: Node) => void,
 * ): Graph
 * ```
 *
 * Iterates over all nodes of a specific type, executing a function for each node. Returns the graph unchanged (for chaining).
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
 * let g = Graph.setNode(graph, { type: "Task", id: "1", title: "First Task" });
 * g = Graph.setNode(g, { type: "Task", id: "2", title: "Second Task" });
 * g = Graph.setNode(g, { type: "Task", id: "3", title: "Third Task" });
 *
 * Graph.forEachNode(g, "Task", (task) => {
 *     console.log(task.title);
 * });
 * // Logs:
 * // "First Task"
 * // "Second Task"
 * // "Third Task"
 * ```
 *
 */
export function forEachNode<
    N extends Node,
    E extends Edges<N>,
    U extends NodeType<N>,
>(
    graph: Graph<N, E>,
    type: U,
    fn: (node: NoInfer<NodeOfType<N, U>>) => void,
): Graph<N, E> {
    for (const node of graph.get("nodes")?.get(type)?.values() ?? [])
        fn(node)
    return graph
}
