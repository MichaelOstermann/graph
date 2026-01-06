import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeType } from "./types"
import { getEdge } from "./getEdge"
import { hasEdge } from "./hasEdge"
import { setEdge } from "./setEdge"

/**
 * # mapEdge
 *
 * ```ts
 * function Graph.mapEdge(
 *     graph: Graph,
 *     source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
 *     target: [NodeType, NodeId] | { type: NodeType, id: NodeId },
 *     update: (edge: EdgeData) => EdgeData,
 * ): Graph
 * ```
 *
 * Updates an edge by applying a transformation function. Returns a new graph instance with the updated edge.
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
 * g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], {
 *     priority: 1,
 *     assignedAt: new Date(),
 * });
 *
 * // Update edge data
 * g = Graph.mapEdge(g, ["Project", "1"], ["Task", "1"], (edge) => ({
 *     ...edge,
 *     priority: 2,
 * }));
 * ```
 *
 */
export function mapEdge<
    N extends Node,
    E extends Edges<N>,
    N1 extends keyof Bimap<E> & NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    source: NodeIdentifier<N, N1>,
    target: NodeIdentifier<N, N2>,
    update: (edge: NoInfer<Bimap<E>[N1][N2]>) => NoInfer<Bimap<E>[N1][N2]>,
): Graph<N, E> {
    if (!hasEdge(graph, source, target)) return graph
    const before = getEdge(graph, source, target)!
    const after = update(before)
    if (before === after) return graph
    return setEdge(graph, source, target, after as any)
}
