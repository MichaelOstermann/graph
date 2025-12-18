# getEdge

```ts
function Graph.getEdge(
    graph: Graph,
    source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    target: [NodeType, NodeId] | { type: NodeType, id: NodeId },
): EdgeData | undefined
```

Retrieves the edge data between two nodes. Returns `undefined` if the edge doesn't exist.

## Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    Project: { Task: { assignedAt: Date } };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
let g = Graph.setNode(graph, { type: "Project", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "1" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], {
    assignedAt: new Date(),
});

const edge = Graph.getEdge(g, ["Project", "1"], ["Task", "1"]);
// edge: { assignedAt: Date }

const missing = Graph.getEdge(g, ["Project", "1"], ["Task", "2"]);
// missing: undefined
```
