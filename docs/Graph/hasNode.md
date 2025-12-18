# hasNode

```ts
function Graph.hasNode(
    graph: Graph,
    node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
): boolean
```

Checks if a node exists in the graph.

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
const withNode = Graph.setNode(graph, { type: "Task", id: "1" });

Graph.hasNode(withNode, ["Task", "1"]); // true
Graph.hasNode(withNode, { type: "Task", id: "1" }); // true
Graph.hasNode(withNode, ["Task", "2"]); // false
```
