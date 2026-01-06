import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeType } from "./types"
import { getEdge } from "./getEdge"
import { hasEdge } from "./hasEdge"
import { setEdge } from "./setEdge"

/**
 * # mergeEdge
 *
 * ```ts
 * function Graph.mergeEdge(
 *     graph: Graph,
 *     source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
 *     target: [NodeType, NodeId] | { type: NodeType, id: NodeId },
 *     update: Partial<EdgeData>,
 * ): Graph
 * ```
 *
 * Partially updates an edge by merging the provided properties. Returns a new graph instance with the updated edge.
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
 * // Merge partial update
 * g = Graph.mergeEdge(g, ["Project", "1"], ["Task", "1"], { priority: 2 });
 *
 * const edge = Graph.getEdge(g, ["Project", "1"], ["Task", "1"]);
 * // edge: { priority: 2, assignedAt: <original date> }
 * ```
 *
 */
export function mergeEdge<
    N extends Node,
    E extends Edges<N>,
    N1 extends keyof Bimap<E> & NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    source: NodeIdentifier<N, N1>,
    target: NodeIdentifier<N, N2>,
    update: Partial<Bimap<E>[N1][N2]>,
): Graph<N, E> {
    if (!hasEdge(graph, source, target)) return graph
    const edge = getEdge(graph, source, target)!
    const keys = Object.keys(update) as (keyof typeof update)[]
    if (keys.length === 0) return graph
    const hasChanges = keys.some(k => update[k] !== edge[k])
    return hasChanges ? setEdge(graph, source, target, { ...edge, ...update } as any) : graph
}
