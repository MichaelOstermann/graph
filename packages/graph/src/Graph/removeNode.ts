import type { Edges, Graph, Node, NodeIdentifier, NodeType } from "./types"
import { batch } from "./batch"
import { unsetInGraph } from "./internals/core"
import { parseNodeIdentifier } from "./internals/parseNodeIdentifier"

/**
 * # removeNode
 *
 * ```ts
 * function Graph.removeNode(
 *     graph: Graph,
 *     node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
 * ): Graph
 * ```
 *
 * Removes a node and all its associated edges from the graph. Returns a new graph instance without the node.
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
 * // Remove the task (also removes the edge)
 * g = Graph.removeNode(g, ["Task", "1"]);
 *
 * Graph.hasNode(g, ["Task", "1"]); // false
 * Graph.hasEdge(g, ["Project", "1"], ["Task", "1"]); // false
 * ```
 *
 */
export function removeNode<
    N extends Node,
    E extends Edges<N>,
    U extends NodeType<N>,
>(
    graph: Graph<N, E>,
    node: NodeIdentifier<N, U>,
): Graph<N, E> {
    const [sourceType, sourceId] = parseNodeIdentifier(node)
    return batch(graph, (graph) => {
        for (const [targetType, targets] of graph.get("edges")?.get(sourceType)?.get(sourceId) ?? []) {
            for (const targetId of targets.keys()) {
                graph = unsetInGraph(graph, ["edges", targetType, targetId, sourceType, sourceId])
            }
        }
        graph = unsetInGraph(graph, ["edges", sourceType, sourceId])
        graph = unsetInGraph(graph, ["nodes", sourceType, sourceId])
        return graph
    })
}
