# findEdges

```ts
function Graph.findEdges(
    graph: Graph,
    source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    type: NodeType,
    find: (edge: EdgeData) => boolean,
): EdgeData[]
```

Finds all edges of a specific type from a source node that match the predicate.

## Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    Project: { Task: { priority: number; assignedAt: Date } };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
let g = Graph.setNode(graph, { type: "Project", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "2" });
g = Graph.setNode(g, { type: "Task", id: "3" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], {
    priority: 1,
    assignedAt: new Date(),
});
g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"], {
    priority: 2,
    assignedAt: new Date(),
});
g = Graph.setEdge(g, ["Project", "1"], ["Task", "3"], {
    priority: 3,
    assignedAt: new Date(),
});

const highPriorityEdges = Graph.findEdges(
    g,
    ["Project", "1"],
    "Task",
    (edge) => edge.priority >= 2,
);
// highPriorityEdges: [{ priority: 2, ... }, { priority: 3, ... }]
```
