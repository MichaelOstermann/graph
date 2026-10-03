import { describe, expect, it } from "bun:test"
import { Graph } from "../src"

type Nodes =
    | { id: string, type: "Project" }
    | { done?: boolean, id: string, title: string, type: "Task" }

type Edges = {
    Project: { Task: { priority: number } }
}

function setup() {
    return Graph.batch(Graph.create<Nodes, Edges>(), (g) => {
        g = Graph.setNode(g, { id: "p1", type: "Project" })
        g = Graph.setNode(g, { id: "t1", title: "One", type: "Task" })
        g = Graph.setNode(g, { id: "t2", title: "Two", type: "Task" })
        g = Graph.setEdge(g, ["Project", "p1"], ["Task", "t1"], { priority: 1 })
        g = Graph.setEdge(g, ["Project", "p1"], ["Task", "t2"], { priority: 2 })
        return g
    })
}

describe("Graph", () => {
    describe("nodes", () => {
        it("should set and get nodes", () => {
            const g = setup()
            expect(Graph.getNode(g, ["Task", "t1"])).toEqual({ id: "t1", title: "One", type: "Task" })
            expect(Graph.getNode(g, { id: "t1", type: "Task" })).toEqual({ id: "t1", title: "One", type: "Task" })
            expect(Graph.getNode(g, ["Task", "t3"])).toBe(undefined)
            expect(Graph.hasNode(g, ["Task", "t1"])).toBe(true)
            expect(Graph.hasNode(g, ["Task", "t3"])).toBe(false)
            expect(Graph.getNodes(g, "Task").map(node => node.id)).toEqual(["t1", "t2"])
        })

        it("should not change the graph it was given", () => {
            const before = Graph.create<Nodes, Edges>()
            const after = Graph.setNode(before, { id: "p1", type: "Project" })
            expect(after).not.toBe(before)
            expect(Graph.hasNode(before, ["Project", "p1"])).toBe(false)
            expect(Graph.hasNode(after, ["Project", "p1"])).toBe(true)
        })

        it("should map and merge nodes", () => {
            let g = setup()
            g = Graph.mapNode(g, ["Task", "t1"], task => ({ ...task, title: "Uno" }))
            g = Graph.mergeNode(g, ["Task", "t2"], { done: true })
            expect(Graph.getNode(g, ["Task", "t1"])).toEqual({ id: "t1", title: "Uno", type: "Task" })
            expect(Graph.getNode(g, ["Task", "t2"])).toEqual({ done: true, id: "t2", title: "Two", type: "Task" })
        })

        it("should find and iterate nodes", () => {
            const g = setup()
            expect(Graph.findNode(g, "Task", task => task.title === "Two")?.id).toBe("t2")
            expect(Graph.findNode(g, "Task", task => task.title === "Three")).toBe(undefined)
            expect(Graph.findNodes(g, "Task", task => task.title !== "Two").map(node => node.id)).toEqual(["t1"])

            const seen: string[] = []
            Graph.forEachNode(g, "Task", node => seen.push(node.id))
            expect(seen).toEqual(["t1", "t2"])
        })

        it("should remove a node together with its edges", () => {
            const g = Graph.removeNode(setup(), ["Task", "t1"])
            expect(Graph.hasNode(g, ["Task", "t1"])).toBe(false)
            expect(Graph.hasEdge(g, ["Project", "p1"], ["Task", "t1"])).toBe(false)
            expect(Graph.getNeighbors(g, ["Project", "p1"], "Task").map(node => node.id)).toEqual(["t2"])
        })
    })

    describe("edges", () => {
        it("should set and get edges", () => {
            const g = setup()
            expect(Graph.getEdge(g, ["Project", "p1"], ["Task", "t1"])).toEqual({ priority: 1 })
            expect(Graph.hasEdge(g, ["Project", "p1"], ["Task", "t1"])).toBe(true)
            expect(Graph.getEdges(g, ["Project", "p1"], "Task")).toEqual([{ priority: 1 }, { priority: 2 }])
        })

        it("should map and merge edges", () => {
            let g = setup()
            g = Graph.mapEdge(g, ["Project", "p1"], ["Task", "t1"], edge => ({ priority: edge.priority + 10 }))
            g = Graph.mergeEdge(g, ["Project", "p1"], ["Task", "t2"], { priority: 20 })
            expect(Graph.getEdges(g, ["Project", "p1"], "Task")).toEqual([{ priority: 11 }, { priority: 20 }])
        })

        it("should find and iterate edges", () => {
            const g = setup()
            expect(Graph.findEdge(g, ["Project", "p1"], "Task", edge => edge.priority > 1)).toEqual({ priority: 2 })
            expect(Graph.findEdges(g, ["Project", "p1"], "Task", edge => edge.priority > 5)).toEqual([])

            const seen: number[] = []
            Graph.forEachEdge(g, ["Project", "p1"], "Task", edge => seen.push(edge.priority))
            expect(seen).toEqual([1, 2])
        })

        it("should remove an edge and keep its nodes", () => {
            const g = Graph.removeEdge(setup(), ["Project", "p1"], ["Task", "t1"])
            expect(Graph.hasEdge(g, ["Project", "p1"], ["Task", "t1"])).toBe(false)
            expect(Graph.hasNode(g, ["Task", "t1"])).toBe(true)
        })
    })

    describe("neighbors", () => {
        it("should get neighbors", () => {
            const g = setup()
            expect(Graph.getNeighbors(g, ["Project", "p1"], "Task").map(node => node.id)).toEqual(["t1", "t2"])
            expect(Graph.getNeighbor(g, ["Project", "p1"], "Task")?.id).toBe("t1")
        })

        it("should find and iterate neighbors with their edge", () => {
            const g = setup()
            expect(Graph.findNeighbor(g, ["Project", "p1"], "Task", (_task, edge) => edge.priority === 2)?.id).toBe("t2")
            expect(Graph.findNeighbors(g, ["Project", "p1"], "Task", (_task, edge) => edge.priority >= 1).map(node => node.id)).toEqual(["t1", "t2"])

            const seen: [string, number, string][] = []
            Graph.forEachNeighbor(g, ["Project", "p1"], "Task", (task, edge, project) => seen.push([task.id, edge.priority, project.id]))
            expect(seen).toEqual([["t1", 1, "p1"], ["t2", 2, "p1"]])
        })
    })

    describe("serialization", () => {
        it("should round-trip through toJS and fromJS", () => {
            const data = Graph.toJS(setup())
            expect<unknown>(data).toEqual({
                edges: [
                    ["Project", "p1", "Task", "t1", { priority: 1 }],
                    ["Project", "p1", "Task", "t2", { priority: 2 }],
                ],
                nodes: [
                    { id: "p1", type: "Project" },
                    { id: "t1", title: "One", type: "Task" },
                    { id: "t2", title: "Two", type: "Task" },
                ],
            })
            expect(Graph.toJS(Graph.fromJS<Nodes, Edges>(data))).toEqual(data)
        })
    })
})
