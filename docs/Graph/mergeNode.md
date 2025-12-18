# mergeNode

```ts
function Graph.mergeNode(
    graph: Graph,
    node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    update: Partial<Node>,
): Graph
```

Partially updates a node by merging the provided properties. Returns a new graph instance with the updated node.

## Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string; title: string; completed: boolean }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    Project: { Task: void };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
let g = Graph.setNode(graph, {
    type: "Task",
    id: "1",
    title: "My Task",
    completed: false,
});

// Merge partial update
g = Graph.mergeNode(g, ["Task", "1"], { completed: true });

const task = Graph.getNode(g, ["Task", "1"]);
// task: { type: "Task", id: "1", title: "My Task", completed: true }
```
