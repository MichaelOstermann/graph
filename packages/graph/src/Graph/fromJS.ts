import type { Edge, Edges, Graph, Node, NodeId } from "./types"
import { batch } from "./batch"
import { create } from "./create"
import { setEdge } from "./setEdge"
import { setNode } from "./setNode"

/**
 * # fromJS
 *
 * ```ts
 * function Graph.fromJS(data: {
 *     nodes: Node[];
 *     edges: [NodeType, NodeId, NodeType, NodeId, EdgeData][];
 * }): Graph
 * ```
 *
 * Creates a graph from a plain JavaScript object representation. Useful for deserializing graphs from JSON or other storage formats.
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
 * const data = {
 *     nodes: [
 *         { type: "Project", id: "1" },
 *         { type: "Task", id: "1", title: "My Task" },
 *         { type: "Task", id: "2", title: "Another Task" },
 *     ],
 *     edges: [
 *         ["Project", "1", "Task", "1", undefined],
 *         ["Project", "1", "Task", "2", undefined],
 *     ],
 * };
 *
 * const graph = Graph.fromJS<Nodes, Edges>(data);
 *
 * Graph.hasNode(graph, ["Project", "1"]); // true
 * Graph.hasEdge(graph, ["Project", "1"], ["Task", "1"]); // true
 * ```
 *
 */
export function fromJS<
    N extends Node,
    E extends Edges<N>,
>(data: {
    edges: [string, NodeId, string, NodeId, Edge][]
    nodes: Node[]
}): Graph<N, E> {
    return batch(create<N, E>(), (graph) => {
        for (const node of data.nodes as any)
            graph = setNode(graph, node)

        for (const [sourceType, sourceId, targetType, targetId, edge] of data.edges as any)
            graph = setEdge(graph, [sourceType, sourceId], [targetType, targetId], edge)

        return graph
    })
}
