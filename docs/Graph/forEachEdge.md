# forEachEdge

```ts
function Graph.forEachEdge(
    graph: Graph,
    source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    type: NodeType,
    fn: (edge: EdgeData) => void,
): Graph
```

Iterates over all edges of a specific type from a source node, executing a function for each edge. Returns the graph unchanged (for chaining).

## Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    Project: { Task: { priority: number } };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
let g = Graph.setNode(graph, { type: "Project", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "2" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], { priority: 1 });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"], { priority: 2 });

Graph.forEachEdge(g, ["Project", "1"], "Task", (edge) => {
    console.log(edge.priority);
});
// Logs:
// 1
// 2
```
