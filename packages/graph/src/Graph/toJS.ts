import type { Edges, Graph, Node, NodeId } from "./types"

export function toJS<
    N extends Node,
    E extends Edges<N>,
>(graph: Graph<N, E>): {
    edges: [string, NodeId, string, NodeId, unknown][]
    nodes: Node[]
} {
    const nodes: Node[] = []
    const edges: [string, NodeId, string, NodeId, unknown][] = []
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
