import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeType } from "./types"
import { batch } from "./batch"
import { unsetInGraph } from "./internals/core"
import { parseNodeIdentifier } from "./internals/parseNodeIdentifier"

/**
 * # removeEdge
 *
 * ```ts
 * function Graph.removeEdge(
 *     graph: Graph,
 *     source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
 *     target: [NodeType, NodeId] | { type: NodeType, id: NodeId },
 * ): Graph
 * ```
 *
 * Removes an edge between two nodes. The nodes remain in the graph. Returns a new graph instance without the edge.
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
 *     Project: { Task: void };
 *     Section: { Task: void };
 * };
 *
 * const graph = Graph.create<Nodes, Edges>();
 * let g = Graph.setNode(graph, { type: "Project", id: "1" });
 * g = Graph.setNode(g, { type: "Task", id: "1" });
 * g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"]);
 *
 * // Remove the edge
 * g = Graph.removeEdge(g, ["Project", "1"], ["Task", "1"]);
 *
 * Graph.hasNode(g, ["Project", "1"]); // true
 * Graph.hasNode(g, ["Task", "1"]); // true
 * Graph.hasEdge(g, ["Project", "1"], ["Task", "1"]); // false
 * ```
 *
 */
export function removeEdge<
    N extends Node,
    E extends Edges<N>,
    N1 extends keyof Bimap<E> & NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    source: NodeIdentifier<N, N1>,
    target: NodeIdentifier<N, N2>,
): Graph<N, E> {
    const [sourceType, sourceId] = parseNodeIdentifier(source)
    const [targetType, targetId] = parseNodeIdentifier(target)

    return batch(graph, (graph) => {
        graph = unsetInGraph(graph, ["edges", sourceType, sourceId, targetType, targetId])
        graph = unsetInGraph(graph, ["edges", targetType, targetId, sourceType, sourceId])
        return graph
    })
}
