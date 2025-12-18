# toJS

```ts
function Graph.toJS(
    graph: Graph,
): {
    nodes: Node[];
    edges: [NodeType, NodeId, NodeType, NodeId, EdgeData][];
}
```

Converts a graph to a plain JavaScript object representation. Useful for serializing graphs to JSON or other storage formats.

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
g = Graph.setNode(g, { type: "Task", id: "1", title: "My Task" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"]);

const data = Graph.toJS(g);
// data: {
//   nodes: [
//     { type: "Project", id: "1" },
//     { type: "Task", id: "1", title: "My Task" }
//   ],
//   edges: [
//     ["Project", "1", "Task", "1", undefined]
//   ]
// }

// Can be serialized to JSON
const json = JSON.stringify(data);
```
