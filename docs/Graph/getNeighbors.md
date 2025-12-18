# getNeighbors

```ts
function Graph.getNeighbors(
    graph: Graph,
    node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    type: NodeType,
): Node[]
```

Retrieves all neighbor nodes of a specific type connected to the source node.

## Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string; title: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    Project: { Task: void };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
let g = Graph.setNode(graph, { type: "Project", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "1", title: "Task 1" });
g = Graph.setNode(g, { type: "Task", id: "2", title: "Task 2" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"]);
g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"]);

const tasks = Graph.getNeighbors(g, ["Project", "1"], "Task");
// tasks: [{ type: "Task", id: "1", title: "Task 1" }, { type: "Task", id: "2", title: "Task 2" }]
```
