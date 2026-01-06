import type { Bimap } from "./internals/types"
import type { Edges, Graph, Node, NodeIdentifier, NodeOfType, NodeType } from "./types"
import { getNode } from "./getNode"

/**
 * # findNeighbor
 *
 * ```ts
 * function Graph.findNeighbor(
 *     graph: Graph,
 *     node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
 *     type: NodeType,
 *     find: (target: Node, edge: EdgeData, source: Node) => boolean,
 * ): Node | undefined
 * ```
 *
 * Finds the first neighbor node of a specific type that matches the predicate. The predicate receives the target node, edge data, and source node. Returns `undefined` if no matching neighbor is found.
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
 * g = Graph.setNode(g, { type: "Task", id: "2", title: "High Priority Task" });
 * g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], { priority: 1 });
 * g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"], { priority: 3 });
 *
 * const highPriorityTask = Graph.findNeighbor(
 *     g,
 *     ["Project", "1"],
 *     "Task",
 *     (task, edge, project) => edge.priority > 2,
 * );
 * // highPriorityTask: { type: "Task", id: "2", title: "High Priority Task" }
 * ```
 *
 */
export function findNeighbor<
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
): N3 | undefined

export function findNeighbor<
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
): NodeOfType<N, N2> | undefined

export function findNeighbor<
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
): NodeOfType<N, N2> | undefined {
    const sourceNode = getNode(graph, node)
    if (!sourceNode) return undefined

    const nodeMap = graph.get("nodes")?.get(type)
    if (!nodeMap) return undefined

    for (const [targetId, edge] of graph.get("edges")?.get(sourceNode.type)?.get(sourceNode.id)?.get(type) ?? []) {
        const targetNode = nodeMap.get(targetId)!
        if (find(targetNode, edge as any, sourceNode)) return targetNode
    }
    return undefined
}
