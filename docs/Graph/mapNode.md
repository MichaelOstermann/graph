# mapNode

```ts
function Graph.mapNode(
    graph: Graph,
    node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    update: (node: Node) => Node,
): Graph
```

Updates a node by applying a transformation function. If the node's type or id changes, all edges are preserved. Returns a new graph instance with the updated node.

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

// Update a property
g = Graph.mapNode(g, ["Task", "1"], (task) => ({
    ...task,
    completed: true,
}));

// Change id (edges are preserved)
let g2 = Graph.setNode(graph, {
    type: "Task",
    id: "1",
    title: "Task",
    completed: false,
});
g2 = Graph.setNode(g2, { type: "Project", id: "1" });
g2 = Graph.setEdge(g2, ["Project", "1"], ["Task", "1"]);
g2 = Graph.mapNode(g2, ["Task", "1"], (task) => ({
    ...task,
    id: "2",
}));
// Edge now connects ["Project", "1"] -> ["Task", "2"]
```
