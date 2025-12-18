# batch

```ts
function Graph.batch(
    graph: Graph,
    transform: (graph: Graph) => Graph | void,
): Graph
```

Performs multiple graph mutations efficiently by batching them together. Returns the original graph if no changes were made, optimizing for structural sharing.

## Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string; title: string }
    | { type: "Section"; id: string; name: string }
    | { type: "Project"; id: string; name: string };

type Edges = {
    Project: { Task: void };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();

// Add multiple nodes and edges in a single batch
const updated = Graph.batch(graph, (g) => {
    g = Graph.setNode(g, { type: "Project", id: "1", name: "My Project" });
    g = Graph.setNode(g, { type: "Task", id: "1", title: "Task 1" });
    g = Graph.setNode(g, { type: "Task", id: "2", title: "Task 2" });
    g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"]);
    g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"]);
    return g;
});
```
