# findNeighbor

```ts
function Graph.findNeighbor(
    graph: Graph,
    node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    type: NodeType,
    find: (target: Node, edge: EdgeData, source: Node) => boolean,
): Node | undefined
```

Finds the first neighbor node of a specific type that matches the predicate. The predicate receives the target node, edge data, and source node. Returns `undefined` if no matching neighbor is found.

## Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string; title: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    Project: { Task: { priority: number } };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
let g = Graph.setNode(graph, { type: "Project", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "1", title: "Low Priority Task" });
g = Graph.setNode(g, { type: "Task", id: "2", title: "High Priority Task" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], { priority: 1 });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"], { priority: 3 });

const highPriorityTask = Graph.findNeighbor(
    g,
    ["Project", "1"],
    "Task",
    (task, edge, project) => edge.priority > 2,
);
// highPriorityTask: { type: "Task", id: "2", title: "High Priority Task" }
```
