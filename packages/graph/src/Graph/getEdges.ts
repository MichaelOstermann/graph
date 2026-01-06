import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeType } from "./types"
import { parseNodeIdentifier } from "./internals/parseNodeIdentifier"

/**
 * # getEdges
 *
 * ```ts
 * function Graph.getEdges(
 *     graph: Graph,
 *     source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
 *     type: NodeType,
 * ): EdgeData[]
 * ```
 *
 * Retrieves all edges of a specific type from a source node.
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
 *     Project: { Task: { priority: number } };
 *     Section: { Task: void };
 * };
 *
 * const graph = Graph.create<Nodes, Edges>();
 * let g = Graph.setNode(graph, { type: "Project", id: "1" });
 * g = Graph.setNode(g, { type: "Task", id: "1" });
 * g = Graph.setNode(g, { type: "Task", id: "2" });
 * g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], { priority: 1 });
 * g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"], { priority: 2 });
 *
 * const edges = Graph.getEdges(g, ["Project", "1"], "Task");
 * // edges: [{ priority: 1 }, { priority: 2 }]
 * ```
 *
 */
export function getEdges<
    N extends Node,
    E extends Edges<N>,
    N1 extends keyof Bimap<E> & NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    source: NodeIdentifier<N, N1>,
    type: N2,
): Bimap<E>[N1][N2][] {
    const [sourceType, sourceId] = parseNodeIdentifier(source)
    const edgeMap = graph.get("edges")?.get(sourceType)?.get(sourceId)?.get(type)
    return edgeMap ? [...edgeMap.values()] as any : []
}
