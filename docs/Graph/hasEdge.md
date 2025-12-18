# hasEdge

```ts
function Graph.hasEdge(
    graph: Graph,
    source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    target: [NodeType, NodeId] | { type: NodeType, id: NodeId },
): boolean
```

Checks if an edge exists between two nodes in the graph.

## Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    Project: { Task: void };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
let g = Graph.setNode(graph, { type: "Project", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "1" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"]);

Graph.hasEdge(g, ["Project", "1"], ["Task", "1"]); // true
Graph.hasEdge(g, ["Task", "1"], ["Project", "1"]); // true (bidirectional)
Graph.hasEdge(g, ["Project", "1"], ["Task", "2"]); // false
```
