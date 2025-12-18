# getNeighbor

```ts
function Graph.getNeighbor(
    graph: Graph,
    node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    type: NodeType,
): Node | undefined
```

Retrieves the first neighbor node of a specific type connected to the source node. Returns `undefined` if no neighbor of the specified type exists.

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

const firstTask = Graph.getNeighbor(g, ["Project", "1"], "Task");
// firstTask: { type: "Task", id: "1", title: "Task 1" }

const noSection = Graph.getNeighbor(g, ["Project", "1"], "Section");
// noSection: undefined
```
