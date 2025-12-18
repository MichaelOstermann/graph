# findNodes

```ts
function Graph.findNodes(
    graph: Graph,
    type: NodeType,
    find: (node: Node) => boolean,
): Node[]
```

Finds all nodes of a specific type that match the predicate.

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

const incompleteTasks = Graph.findNodes(g, "Task", (task) => !task.completed);
// incompleteTasks: [
//   { type: "Task", id: "1", title: "First Task", completed: false },
//   { type: "Task", id: "3", title: "Third Task", completed: false }
// ]
```
