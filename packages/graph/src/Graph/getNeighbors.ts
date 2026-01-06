import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeOfType, NodeType } from "./types"
import { getNode } from "./getNode"

/**
 * # getNeighbors
 *
 * ```ts
 * function Graph.getNeighbors(
 *     graph: Graph,
 *     node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
 *     type: NodeType,
 * ): Node[]
 * ```
 *
 * Retrieves all neighbor nodes of a specific type connected to the source node.
 *
 * ## Example
 *
 * ```ts
 * import { Graph } from "@monstermann/graph";
 *
 * type Nodes =
 *     | { type: "Task"; id: string; title: string }
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
 * g = Graph.setNode(g, { type: "Task", id: "1", title: "Task 1" });
 * g = Graph.setNode(g, { type: "Task", id: "2", title: "Task 2" });
 * g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"]);
 * g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"]);
 *
 * const tasks = Graph.getNeighbors(g, ["Project", "1"], "Task");
 * // tasks: [{ type: "Task", id: "1", title: "Task 1" }, { type: "Task", id: "2", title: "Task 2" }]
 * ```
 *
 */
export function getNeighbors<
    N extends Node,
    E extends Edges<N>,
    N1 extends NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    node: NodeIdentifier<N, N1>,
    type: N2,
): NodeOfType<N, N2>[] {
    const result: NodeOfType<N, N2>[] = []
    const sourceNode = getNode(graph, node)
    if (!sourceNode) return result

    const nodeMap = graph.get("nodes")?.get(type)
    if (!nodeMap) return result

    for (const targetId of graph.get("edges")?.get(sourceNode.type)?.get(sourceNode.id)?.get(type)?.keys() ?? []) {
        const targetNode = nodeMap.get(targetId)!
        result.push(targetNode)
    }
    return result
}
