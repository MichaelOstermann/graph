import type { Graph } from "../types"

export function setInGraph(graph: Graph<any, any>, path: PropertyKey[], value: any): Graph<any, any> {
    return setInMap(graph.get("clones"), graph, path, value)
}

export function unsetInGraph(graph: Graph<any, any>, path: PropertyKey[]): Graph<any, any> {
    return unsetInMap(graph.get("clones"), graph, path)
}

const emptyMap = new Map()

function setInMap(
    clones: Set<any> | undefined,
    map: Map<any, any>,
    path: PropertyKey[],
    value: any,
    offset: number = 0,
): Map<any, any> {
    if (path.length === 0) return map

    const key = path[offset]!
    const isLast = offset === path.length - 1

    if (isLast)
        return set(map, key, value, clones)

    const child = setInMap(
        clones,
        map.get(key) ?? createMap(clones),
        path,
        value,
        offset + 1,
    )

    return set(map, key, child, clones)
}

function unsetInMap(
    clones: Set<any> | undefined,
    map: Map<any, any>,
    path: PropertyKey[],
    offset: number = 0,
): Map<any, any> {
    if (path.length === 0) return emptyMap

    const key = path[offset]!
    const isLast = offset === path.length - 1

    if (!map.has(key))
        return map

    if (isLast)
        return unset(map, key, clones)

    const child = unsetInMap(
        clones,
        map.get(key),
        path,
        offset + 1,
    )

    if (child.size === 0)
        return unset(map, key, clones)

    return set(map, key, child, clones)
}

function createMap(clones: Set<any> | undefined): Map<any, any> {
    const map = new Map()
    clones?.add(map)
    return map
}

function set(map: Map<any, any>, key: PropertyKey, value: any, clones: Set<any> | undefined): Map<any, any> {
    if (map.get(key) === value) return map
    const clone = cloneMap(map, clones) as Map<any, any>
    clone.set(key, value)
    return clone
}

function unset(map: Map<any, any>, key: PropertyKey, clones: Set<any> | undefined): Map<any, any> {
    if (map.size === 1) return emptyMap
    const clone = cloneMap(map, clones) as Map<any, any>
    clone.delete(key)
    return clone
}

function cloneMap(target: Map<any, any>, clones: Set<any> | undefined): Map<any, any> {
    if (!clones) return new Map(target)
    if (clones.has(target)) return target
    const clone = new Map(target)
    clones.add(clone)
    return clone
}
