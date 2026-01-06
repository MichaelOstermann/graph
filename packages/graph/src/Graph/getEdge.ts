import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeType } from "./types"
import { parseNodeIdentifier } from "./internals/parseNodeIdentifier"

/**
 * # getEdge
 *
 * ```ts
 * function Graph.getEdge(
 *     graph: Graph,
 *     source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
 *     target: [NodeType, NodeId] | { type: NodeType, id: NodeId },
 * ): EdgeData | undefined
 * ```
 *
 * Retrieves the edge data between two nodes. Returns `undefined` if the edge doesn't exist.
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
 *     Project: { Task: { assignedAt: Date } };
 *     Section: { Task: void };
 * };
 *
 * const graph = Graph.create<Nodes, Edges>();
 * let g = Graph.setNode(graph, { type: "Project", id: "1" });
 * g = Graph.setNode(g, { type: "Task", id: "1" });
 * g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], {
 *     assignedAt: new Date(),
 * });
 *
 * const edge = Graph.getEdge(g, ["Project", "1"], ["Task", "1"]);
 * // edge: { assignedAt: Date }
 *
 * const missing = Graph.getEdge(g, ["Project", "1"], ["Task", "2"]);
 * // missing: undefined
 * ```
 *
 */
export function getEdge<
    N extends Node,
    E extends Edges<N>,
    N1 extends keyof Bimap<E> & NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    source: NodeIdentifier<N, N1>,
    target: NodeIdentifier<N, N2>,
): Bimap<E>[N1][N2] | undefined {
    const [sourceType, sourceId] = parseNodeIdentifier(source)
    const [targetType, targetId] = parseNodeIdentifier(target)

    return graph
        .get("edges")
        ?.get(sourceType)
        ?.get(sourceId)
        ?.get(targetType)
        ?.get(targetId) as any
}
