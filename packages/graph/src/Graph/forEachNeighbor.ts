import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeOfType, NodeType } from "./types"
import { getNode } from "./getNode"

/**
 * # forEachNeighbor
 *
 * ```ts
 * function Graph.forEachNeighbor(
 *     graph: Graph,
 *     node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
 *     type: NodeType,
 *     fn: (target: Node, edge: EdgeData, source: Node) => void,
 * ): Graph
 * ```
 *
 * Iterates over all neighbor nodes of a specific type, executing a function for each neighbor. The function receives the target node, edge data, and source node. Returns the graph unchanged (for chaining).
 *
 * ## Example
 *
 * ```ts
 * import { Graph } from "@monstermann/graph";
 *
 * type Nodes =
 *     | { type: "Task"; id: string; title: string }
 *     | { type: "Section"; id: string }
 *     | { type: "Project"; id: string; name: string };
 *
 * type Edges = {
 *     Project: { Task: { priority: number } };
 *     Section: { Task: void };
 * };
 *
 * const graph = Graph.create<Nodes, Edges>();
 * let g = Graph.setNode(graph, { type: "Project", id: "1", name: "My Project" });
 * g = Graph.setNode(g, { type: "Task", id: "1", title: "First Task" });
 * g = Graph.setNode(g, { type: "Task", id: "2", title: "Second Task" });
 * g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], { priority: 1 });
 * g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"], { priority: 2 });
 *
 * Graph.forEachNeighbor(g, ["Project", "1"], "Task", (task, edge, project) => {
 *     console.log(`${project.name}: ${task.title} (priority: ${edge.priority})`);
 * });
 * // Logs:
 * // "My Project: First Task (priority: 1)"
 * // "My Project: Second Task (priority: 2)"
 * ```
 *
 */
export function forEachNeighbor<
    N extends Node,
    E extends Edges<N>,
    N1 extends NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    node: NodeIdentifier<N, N1>,
    type: N2,
    fn: (
        target: NoInfer<NodeOfType<N, N2>>,
        edge: NoInfer<Bimap<E>[N1][N2]>,
        source: NoInfer<NodeOfType<N, N1>>,
    ) => void,
): Graph<N, E> {
    const sourceNode = getNode(graph, node)
    if (!sourceNode) return graph

    const nodeMap = graph.get("nodes")?.get(type)
    if (!nodeMap) return graph

    for (const [targetId, edge] of graph.get("edges")?.get(sourceNode.type)?.get(sourceNode.id)?.get(type) ?? []) {
        const targetNode = nodeMap.get(targetId)!
        fn(targetNode, edge as any, sourceNode)
    }
    return graph
}
