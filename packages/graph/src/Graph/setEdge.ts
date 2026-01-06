import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeType } from "./types"
import { batch } from "./batch"
import { hasNode } from "./hasNode"
import { setInGraph } from "./internals/core"
import { parseNodeIdentifier } from "./internals/parseNodeIdentifier"

/**
 * # setEdge
 *
 * ```ts
 * function Graph.setEdge(
 *     graph: Graph,
 *     source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
 *     target: [NodeType, NodeId] | { type: NodeType, id: NodeId },
 *     data?: EdgeData,
 * ): Graph
 * ```
 *
 * Adds or updates an edge between two nodes. Both nodes must exist in the graph. Returns a new graph instance with the edge set. Edges are bidirectional.
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
 *
 * // Add edge with data
 * g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], {
 *     assignedAt: new Date(),
 * });
 *
 * // Add edge without data (void)
 * let g2 = Graph.setNode(graph, { type: "Section", id: "1" });
 * g2 = Graph.setNode(g2, { type: "Task", id: "1" });
 * g2 = Graph.setEdge(g2, ["Section", "1"], ["Task", "1"]);
 * ```
 *
 */
export function setEdge<
    N extends Node,
    E extends Edges<N>,
    N1 extends keyof Bimap<E> & NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    source: NodeIdentifier<N, N1>,
    target: NodeIdentifier<N, N2>,
    ...args: Bimap<E>[N1][N2] extends void ? [] | [data: void] : [data: Bimap<E>[N1][N2]]
): Graph<N, E> {
    const edge = args[0] as Bimap<E>[N1][N2]
    const [sourceType, sourceId] = parseNodeIdentifier(source)
    const [targetType, targetId] = parseNodeIdentifier(target)

    if (!hasNode(graph, source)) return graph
    if (!hasNode(graph, target)) return graph

    return batch(graph, (graph) => {
        graph = setInGraph(graph, ["edges", sourceType, sourceId, targetType, targetId], edge)
        graph = setInGraph(graph, ["edges", targetType, targetId, sourceType, sourceId], edge)
        return graph
    })
}
