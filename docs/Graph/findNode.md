# findNode

```ts
function Graph.findNode(
    graph: Graph,
    type: NodeType,
    find: (node: Node) => boolean,
): Node | undefined
```

Finds the first node of a specific type that matches the predicate. Returns `undefined` if no matching node is found.

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
    title: "First Task",
    completed: false,
});
g = Graph.setNode(g, {
    type: "Task",
    id: "2",
    title: "Second Task",
    completed: true,
});
g = Graph.setNode(g, {
    type: "Task",
    id: "3",
    title: "Third Task",
    completed: false,
});

const completedTask = Graph.findNode(g, "Task", (task) => task.completed);
// completedTask: { type: "Task", id: "2", title: "Second Task", completed: true }

const taskWithTitle = Graph.findNode(
    g,
    "Task",
    (task) => task.title === "First Task",
);
// taskWithTitle: { type: "Task", id: "1", title: "First Task", completed: false }
```
