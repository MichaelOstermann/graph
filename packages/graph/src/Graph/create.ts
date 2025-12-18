import type { Edges, Graph, Node, NodeType } from "./types"

export function create<
    N extends Node,
    E extends Edges<N> = Record<NodeType<N>, Record<NodeType<N>, void>>,
>(): Graph<N, E> {
    return new Map()
}
