# mergeEdge

```ts
function Graph.mergeEdge(
    graph: Graph,
    source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    target: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    update: Partial<EdgeData>,
): Graph
```

Partially updates an edge by merging the provided properties. Returns a new graph instance with the updated edge.

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
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], {
    priority: 1,
    assignedAt: new Date(),
});

// Merge partial update
g = Graph.mergeEdge(g, ["Project", "1"], ["Task", "1"], { priority: 2 });

const edge = Graph.getEdge(g, ["Project", "1"], ["Task", "1"]);
// edge: { priority: 2, assignedAt: <original date> }
```
