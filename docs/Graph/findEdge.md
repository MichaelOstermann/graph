# findEdge

```ts
function Graph.findEdge(
    graph: Graph,
    source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    type: NodeType,
    find: (edge: EdgeData) => boolean,
): EdgeData | undefined
```

Finds the first edge of a specific type from a source node that matches the predicate. Returns `undefined` if no matching edge is found.

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
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], {
    priority: 1,
    assignedAt: new Date(),
});
g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"], {
    priority: 2,
    assignedAt: new Date(),
});

const highPriorityEdge = Graph.findEdge(
    g,
    ["Project", "1"],
    "Task",
    (edge) => edge.priority > 1,
);
// highPriorityEdge: { priority: 2, assignedAt: Date }
```
