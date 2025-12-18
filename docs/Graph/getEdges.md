# getEdges

```ts
function Graph.getEdges(
    graph: Graph,
    source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    type: NodeType,
): EdgeData[]
```

Retrieves all edges of a specific type from a source node.

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

const edges = Graph.getEdges(g, ["Project", "1"], "Task");
// edges: [{ priority: 1 }, { priority: 2 }]
```
