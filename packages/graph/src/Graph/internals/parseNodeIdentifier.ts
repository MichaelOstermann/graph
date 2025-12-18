import type { Node, NodeIdentifier, NodeType } from "../types"

export function parseNodeIdentifier<T extends Node, U extends NodeType<T>>(
    identifier: NodeIdentifier<T, U>,
): [U, Extract<T, { type: U }>["id"]] {
    return Array.isArray(identifier)
        ? identifier
        : [identifier.type, identifier.id]
}
