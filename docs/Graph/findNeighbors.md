# findNeighbors

```ts
function Graph.findNeighbors(
    graph: Graph,
    node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    type: NodeType,
    find: (target: Node, edge: EdgeData, source: Node) => boolean,
): Node[]
```

Finds all neighbor nodes of a specific type that match the predicate. The predicate receives the target node, edge data, and source node.

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
g = Graph.setNode(g, { type: "Task", id: "2", title: "Medium Priority Task" });
g = Graph.setNode(g, { type: "Task", id: "3", title: "High Priority Task" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], { priority: 1 });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"], { priority: 2 });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "3"], { priority: 3 });

const mediumAndHighPriority = Graph.findNeighbors(
    g,
    ["Project", "1"],
    "Task",
    (task, edge, project) => edge.priority >= 2,
);
// mediumAndHighPriority: [
//   { type: "Task", id: "2", title: "Medium Priority Task" },
//   { type: "Task", id: "3", title: "High Priority Task" }
// ]
```
