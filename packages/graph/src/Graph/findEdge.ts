import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeType } from "./types"
import { parseNodeIdentifier } from "./internals/parseNodeIdentifier"

/**
 * # findEdge
 *
 * ```ts
 * function Graph.findEdge(
 *     graph: Graph,
 *     source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
 *     type: NodeType,
 *     find: (edge: EdgeData) => boolean,
 * ): EdgeData | undefined
 * ```
 *
 * Finds the first edge of a specific type from a source node that matches the predicate. Returns `undefined` if no matching edge is found.
 *
 * ## Example
 *
 * ```ts
 * import { Graph } from "@monstermann/graph";
 *
 * type Nodes =
 *     | { type: "Task"; id: string }
 *     | { type: "Section"; id: string }
 *     | { type: "Project"; id: string };
 *
 * type Edges = {
 *     Project: { Task: { priority: number; assignedAt: Date } };
 *     Section: { Task: void };
 * };
 *
 * const graph = Graph.create<Nodes, Edges>();
 * let g = Graph.setNode(graph, { type: "Project", id: "1" });
 * g = Graph.setNode(g, { type: "Task", id: "1" });
 * g = Graph.setNode(g, { type: "Task", id: "2" });
 * g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], {
 *     priority: 1,
 *     assignedAt: new Date(),
 * });
 * g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"], {
 *     priority: 2,
 *     assignedAt: new Date(),
 * });
 *
 * const highPriorityEdge = Graph.findEdge(
 *     g,
 *     ["Project", "1"],
 *     "Task",
 *     (edge) => edge.priority > 1,
 * );
 * // highPriorityEdge: { priority: 2, assignedAt: Date }
 * ```
 *
 */
export function findEdge<
    N extends Node,
    E extends Edges<N>,
    N1 extends keyof Bimap<E> & NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
    E2 extends Bimap<E>[N1][N2],
>(
    graph: Graph<N, E>,
    source: NodeIdentifier<N, N1>,
    type: N2,
    find: (edge: NoInfer<Bimap<E>[N1][N2]>) => edge is E2,
): E2 | undefined

export function findEdge<
    N extends Node,
    E extends Edges<N>,
    N1 extends keyof Bimap<E> & NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    source: NodeIdentifier<N, N1>,
    type: N2,
    find: (edge: NoInfer<Bimap<E>[N1][N2]>) => boolean,
): Bimap<E>[N1][N2] | undefined

export function findEdge<
    N extends Node,
    E extends Edges<N>,
    N1 extends keyof Bimap<E> & NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    source: NodeIdentifier<N, N1>,
    type: N2,
    find: (edge: NoInfer<Bimap<E>[N1][N2]>) => boolean,
): Bimap<E>[N1][N2] | undefined {
    const [sourceType, sourceId] = parseNodeIdentifier(source)
    for (const edge of graph.get("edges")?.get(sourceType)?.get(sourceId)?.get(type)?.values() ?? []) {
        if (find(edge as any)) return edge as any
    }
    return undefined
}
