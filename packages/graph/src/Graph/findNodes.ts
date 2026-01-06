import type { Edges, Graph, Node, NodeOfType, NodeType } from "./types"

/**
 * # findNodes
 *
 * ```ts
 * function Graph.findNodes(
 *     graph: Graph,
 *     type: NodeType,
 *     find: (node: Node) => boolean,
 * ): Node[]
 * ```
 *
 * Finds all nodes of a specific type that match the predicate.
 *
 * ## Example
 *
 * ```ts
 * import { Graph } from "@monstermann/graph";
 *
 * type Nodes =
 *     | { type: "Task"; id: string; title: string; completed: boolean }
 *     | { type: "Section"; id: string }
 *     | { type: "Project"; id: string };
 *
 * type Edges = {
 *     Project: { Task: void };
 *     Section: { Task: void };
 * };
 *
 * const graph = Graph.create<Nodes, Edges>();
 * let g = Graph.setNode(graph, {
 *     type: "Task",
 *     id: "1",
 *     title: "First Task",
 *     completed: false,
 * });
 * g = Graph.setNode(g, {
 *     type: "Task",
 *     id: "2",
 *     title: "Second Task",
 *     completed: true,
 * });
 * g = Graph.setNode(g, {
 *     type: "Task",
 *     id: "3",
 *     title: "Third Task",
 *     completed: false,
 * });
 *
 * const incompleteTasks = Graph.findNodes(g, "Task", (task) => !task.completed);
 * // incompleteTasks: [
 * //   { type: "Task", id: "1", title: "First Task", completed: false },
 * //   { type: "Task", id: "3", title: "Third Task", completed: false }
 * // ]
 * ```
 *
 */
export function findNodes<
    N extends Node,
    E extends Edges<N>,
    U extends NodeType<N>,
    V extends NodeOfType<N, U>,
>(
    graph: Graph<N, E>,
    type: U,
    find: (node: NoInfer<NodeOfType<N, U>>) => node is V,
): V[]

export function findNodes<
    N extends Node,
    E extends Edges<N>,
    U extends NodeType<N>,
>(
    graph: Graph<N, E>,
    type: U,
    find: (node: NoInfer<NodeOfType<N, U>>) => boolean,
): NodeOfType<N, U>[]

export function findNodes<
    N extends Node,
    E extends Edges<N>,
    U extends NodeType<N>,
>(
    graph: Graph<N, E>,
    type: U,
    find: (node: NoInfer<NodeOfType<N, U>>) => boolean,
): NodeOfType<N, U>[] {
    const result: NodeOfType<N, U>[] = []
    for (const node of graph.get("nodes")?.get(type)?.values() ?? []) {
        if (find(node)) result.push(node)
    }
    return result
}
