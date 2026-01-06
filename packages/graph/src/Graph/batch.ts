import type { Edges, Graph, Node } from "./types"

/**
 * # batch
 *
 * ```ts
 * function Graph.batch(
 *     graph: Graph,
 *     transform: (graph: Graph) => Graph | void,
 * ): Graph
 * ```
 *
 * Performs multiple graph mutations efficiently by batching them together. Returns the original graph if no changes were made, optimizing for structural sharing.
 *
 * ## Example
 *
 * ```ts
 * import { Graph } from "@monstermann/graph";
 *
 * type Nodes =
 *     | { type: "Task"; id: string; title: string }
 *     | { type: "Section"; id: string; name: string }
 *     | { type: "Project"; id: string; name: string };
 *
 * type Edges = {
 *     Project: { Task: void };
 *     Section: { Task: void };
 * };
 *
 * const graph = Graph.create<Nodes, Edges>();
 *
 * // Add multiple nodes and edges in a single batch
 * const updated = Graph.batch(graph, (g) => {
 *     g = Graph.setNode(g, { type: "Project", id: "1", name: "My Project" });
 *     g = Graph.setNode(g, { type: "Task", id: "1", title: "Task 1" });
 *     g = Graph.setNode(g, { type: "Task", id: "2", title: "Task 2" });
 *     g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"]);
 *     g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"]);
 *     return g;
 * });
 * ```
 *
 */
export function batch<N extends Node, E extends Edges<N>>(
    prevGraph: Graph<N, E>,
    transform: (graph: Graph<N, E>) => Graph<N, E> | void,
): Graph<N, E> {
    if (prevGraph.has("clones")) return transform(prevGraph) ?? prevGraph
    const clone = new Map(prevGraph) as Graph<N, E>
    clone.set("clones", new Set([clone]))
    const nextGraph = transform(clone) ?? clone
    if (isEqual(prevGraph, nextGraph)) return prevGraph
    nextGraph.delete("clones")
    return nextGraph
}

function isEqual(
    before: Graph<any, any>,
    after: Graph<any, any>,
): boolean {
    return before.get("nodes") === after.get("nodes")
        && before.get("edges") === after.get("edges")
}
