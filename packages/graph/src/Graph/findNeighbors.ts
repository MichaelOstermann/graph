import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeOfType, NodeType } from "./types"
import { getNode } from "./getNode"

/**
 * # findNeighbors
 *
 * ```ts
 * function Graph.findNeighbors(
 *     graph: Graph,
 *     node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
 *     type: NodeType,
 *     find: (target: Node, edge: EdgeData, source: Node) => boolean,
 * ): Node[]
 * ```
 *
 * Finds all neighbor nodes of a specific type that match the predicate. The predicate receives the target node, edge data, and source node.
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
 *     Project: { Task: { priority: number } };
 *     Section: { Task: void };
 * };
 *
 * const graph = Graph.create<Nodes, Edges>();
 * let g = Graph.setNode(graph, { type: "Project", id: "1" });
 * g = Graph.setNode(g, { type: "Task", id: "1", title: "Low Priority Task" });
 * g = Graph.setNode(g, { type: "Task", id: "2", title: "Medium Priority Task" });
 * g = Graph.setNode(g, { type: "Task", id: "3", title: "High Priority Task" });
 * g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], { priority: 1 });
 * g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"], { priority: 2 });
 * g = Graph.setEdge(g, ["Project", "1"], ["Task", "3"], { priority: 3 });
 *
 * const mediumAndHighPriority = Graph.findNeighbors(
 *     g,
 *     ["Project", "1"],
 *     "Task",
 *     (task, edge, project) => edge.priority >= 2,
 * );
 * // mediumAndHighPriority: [
 * //   { type: "Task", id: "2", title: "Medium Priority Task" },
 * //   { type: "Task", id: "3", title: "High Priority Task" }
 * // ]
 * ```
 *
 */
export function findNeighbors<
    N extends Node,
    E extends Edges<N>,
    N1 extends NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
    N3 extends NodeOfType<N, N2>,
>(
    graph: Graph<N, E>,
    node: NodeIdentifier<N, N1>,
    type: N2,
    find: (
        target: NoInfer<NodeOfType<N, N2>>,
        edge: NoInfer<Bimap<E>[N1][N2]>,
        source: NoInfer<NodeOfType<N, N1>>,
    ) => target is N3,
): N3[]

export function findNeighbors<
    N extends Node,
    E extends Edges<N>,
    N1 extends NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    node: NodeIdentifier<N, N1>,
    type: N2,
    find: (
        target: NoInfer<NodeOfType<N, N2>>,
        edge: NoInfer<Bimap<E>[N1][N2]>,
        source: NoInfer<NodeOfType<N, N1>>,
    ) => boolean,
): NodeOfType<N, N2>[]

export function findNeighbors<
    N extends Node,
    E extends Edges<N>,
    N1 extends NodeType<N>,
    N2 extends keyof Bimap<E>[N1] & NodeType<N>,
>(
    graph: Graph<N, E>,
    node: NodeIdentifier<N, N1>,
    type: N2,
    find: (
        target: NoInfer<NodeOfType<N, N2>>,
        edge: NoInfer<Bimap<E>[N1][N2]>,
        source: NoInfer<NodeOfType<N, N1>>,
    ) => boolean,
): NodeOfType<N, N2>[] {
    const result: NodeOfType<N, N2>[] = []
    const sourceNode = getNode(graph, node)
    if (!sourceNode) return result

    const nodeMap = graph.get("nodes")?.get(type)
    if (!nodeMap) return result

    for (const [targetId, edge] of graph.get("edges")?.get(sourceNode.type)?.get(sourceNode.id)?.get(type) ?? []) {
        const targetNode = nodeMap.get(targetId)!
        if (find(targetNode, edge as any, sourceNode)) result.push(targetNode)
    }
    return result
}
