# removeEdge

```ts
function Graph.removeEdge(
    graph: Graph,
    source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    target: [NodeType, NodeId] | { type: NodeType, id: NodeId },
): Graph
```

Removes an edge between two nodes. The nodes remain in the graph. Returns a new graph instance without the edge.

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

// Remove the edge
g = Graph.removeEdge(g, ["Project", "1"], ["Task", "1"]);

Graph.hasNode(g, ["Project", "1"]); // true
Graph.hasNode(g, ["Task", "1"]); // true
Graph.hasEdge(g, ["Project", "1"], ["Task", "1"]); // false
```
