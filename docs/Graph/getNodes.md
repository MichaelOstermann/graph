# getNodes

```ts
function Graph.getNodes(
    graph: Graph,
    type: NodeType,
): Node[]
```

Retrieves all nodes of a specific type from the graph.

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
let g = Graph.setNode(graph, { type: "Task", id: "1", title: "Task 1" });
g = Graph.setNode(g, { type: "Task", id: "2", title: "Task 2" });
g = Graph.setNode(g, { type: "Project", id: "1" });

const tasks = Graph.getNodes(g, "Task");
// tasks: [{ type: "Task", id: "1", title: "Task 1" }, { type: "Task", id: "2", title: "Task 2" }]

const projects = Graph.getNodes(g, "Project");
// projects: [{ type: "Project", id: "1" }]
```
