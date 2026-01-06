import type { Edge, Edges, Graph, Node, NodeId } from "./types"

/**
 * # toJS
 *
 * ```ts
 * function Graph.toJS(
 *     graph: Graph,
 * ): {
 *     nodes: Node[];
 *     edges: [NodeType, NodeId, NodeType, NodeId, EdgeData][];
 * }
 * ```
 *
 * Converts a graph to a plain JavaScript object representation. Useful for serializing graphs to JSON or other storage formats.
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
 * g = Graph.setNode(g, { type: "Task", id: "1", title: "My Task" });
 * g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"]);
 *
 * const data = Graph.toJS(g);
 * // data: {
 * //   nodes: [
 * //     { type: "Project", id: "1" },
 * //     { type: "Task", id: "1", title: "My Task" }
 * //   ],
 * //   edges: [
 * //     ["Project", "1", "Task", "1", undefined]
 * //   ]
 * // }
 *
 * // Can be serialized to JSON
 * const json = JSON.stringify(data);
 * ```
 *
 */
export function toJS<
    N extends Node,
    E extends Edges<N>,
>(graph: Graph<N, E>): {
    edges: [string, NodeId, string, NodeId, Edge][]
    nodes: Node[]
} {
    const nodes: Node[] = []
    const edges: [string, NodeId, string, NodeId, Edge][] = []
    const seenEdges = new Set<string>()

    for (const ids of graph.get("nodes")?.values() ?? []) {
        for (const node of ids.values()) {
            nodes.push(node)
        }
    }

    for (const [sourceType, sourceIds] of graph.get("edges") ?? []) {
        for (const [sourceId, targetTypes] of sourceIds) {
            for (const [targetType, targetIds] of targetTypes) {
                for (const [targetId, edge] of targetIds) {
                    const key = createEdgeKey(sourceType, String(sourceId), targetType, String(targetId))
                    if (seenEdges.has(key)) continue
                    seenEdges.add(key)
                    edges.push([sourceType, sourceId, targetType, targetId, edge])
                }
            }
        }
    }

    return {
        edges,
        nodes,
    }
}

function createEdgeKey(type1: string, id1: string, type2: string, id2: string): string {
    const cmp = type1.localeCompare(type2)
    if (cmp < 0) {
        return `${type1}\0${id1}\0${type2}\0${id2}`
    }
    else if (cmp > 0) {
        return `${type2}\0${id2}\0${type1}\0${id1}`
    }
    else {
        return id1 < id2
            ? `${type1}\0${id1}\0${type2}\0${id2}`
            : `${type2}\0${id2}\0${type1}\0${id1}`
    }
}
