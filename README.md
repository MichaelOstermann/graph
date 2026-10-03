<div align="center">

<h1>graph</h1>

**Functional graph data-structure.**

</div>

## Example

```ts
import { Graph } from "@monstermann/graph";

// Define your node and edge types
type Nodes =
    | { type: "User"; id: string; name: string }
    | { type: "Post"; id: string; title: string }
    | { type: "Comment"; id: string; text: string };

type Edges = {
    User: { Post: { role: "author" | "editor" }; Comment: void };
    Post: { Comment: void };
};

// Create a graph
const graph = Graph.create<Nodes, Edges>();

// Add nodes
let g = Graph.setNode(graph, { type: "User", id: "1", name: "Alice" });
g = Graph.setNode(g, { type: "Post", id: "1", title: "Hello World" });
g = Graph.setNode(g, { type: "Comment", id: "1", text: "Great post!" });

// Add edges with data
g = Graph.setEdge(g, ["User", "1"], ["Post", "1"], { role: "author" });
g = Graph.setEdge(g, ["User", "1"], ["Comment", "1"]);
g = Graph.setEdge(g, ["Post", "1"], ["Comment", "1"]);

// Query the graph
const user = Graph.getNode(g, ["User", "1"]);
// user: { type: "User", id: "1", name: "Alice" }

const userPosts = Graph.getNeighbors(g, ["User", "1"], "Post");
// userPosts: [{ type: "Post", id: "1", title: "Hello World" }]

const postEdge = Graph.getEdge(g, ["User", "1"], ["Post", "1"]);
// postEdge: { role: "author" }
```

## Installation

```sh
bun add @monstermann/graph
```

## API

Everything is documented with JSDoc, including examples. A graph is immutable, every function returns a new graph, or the same one when nothing changed.

|           |                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------- |
| Graph     | `create`, `batch`, `fromJS`, `toJS`                                                                                       |
| Nodes     | `setNode`, `mapNode`, `mergeNode`, `removeNode`, `getNode`, `getNodes`, `hasNode`, `findNode`, `findNodes`, `forEachNode` |
| Edges     | `setEdge`, `mapEdge`, `mergeEdge`, `removeEdge`, `getEdge`, `getEdges`, `hasEdge`, `findEdge`, `findEdges`, `forEachEdge` |
| Neighbors | `getNeighbor`, `getNeighbors`, `findNeighbor`, `findNeighbors`, `forEachNeighbor`                                         |

## Tree-shaking

`Graph` is a single object. To only bundle the functions that are used, replace its members with direct imports using [`@monstermann/barrels-treeshake`](https://github.com/MichaelOstermann/barrels):

```ts
import { treeshake } from "@monstermann/barrels-treeshake";

export default defineConfig({
    plugins: [
        treeshake({
            resolve({ importAlias, importName, importPath, propertyName }) {
                if (
                    importPath !== "@monstermann/graph" ||
                    importName !== "Graph"
                )
                    return;
                return `import { ${propertyName} as ${importAlias} } from "@monstermann/graph/Graph/${propertyName}.mjs";`;
            },
        }),
    ],
});
```
