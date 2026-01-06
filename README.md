<div align="center">

<h1>graph</h1>

![Minified](https://img.shields.io/badge/Minified-5.21_KB-blue?style=flat-square&labelColor=%2315161D&color=%2369a1ff) ![Minzipped](https://img.shields.io/badge/Minzipped-1.54_KB-blue?style=flat-square&labelColor=%2315161D&color=%2369a1ff)

**Functional graph data-structure.**

[Documentation](https://MichaelOstermann.github.io/graph)

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

```sh [npm]
npm install @monstermann/graph
```

```sh [pnpm]
pnpm add @monstermann/graph
```

```sh [yarn]
yarn add @monstermann/graph
```

```sh [bun]
bun add @monstermann/graph
```

## Tree-shaking

### Installation

```sh [npm]
npm install -D @monstermann/unplugin-graph
```

```sh [pnpm]
pnpm -D add @monstermann/unplugin-graph
```

```sh [yarn]
yarn -D add @monstermann/unplugin-graph
```

```sh [bun]
bun -D add @monstermann/unplugin-graph
```

### Usage

```ts [Vite]
// vite.config.ts
import graph from "@monstermann/unplugin-graph/vite";

export default defineConfig({
    plugins: [graph()],
});
```

```ts [Rollup]
// rollup.config.js
import graph from "@monstermann/unplugin-graph/rollup";

export default {
    plugins: [graph()],
};
```

```ts [Rolldown]
// rolldown.config.js
import graph from "@monstermann/unplugin-graph/rolldown";

export default {
    plugins: [graph()],
};
```

```ts [Webpack]
// webpack.config.js
const graph = require("@monstermann/unplugin-graph/webpack");

module.exports = {
    plugins: [graph()],
};
```

```ts [Rspack]
// rspack.config.js
const graph = require("@monstermann/unplugin-graph/rspack");

module.exports = {
    plugins: [graph()],
};
```

```ts [ESBuild]
// esbuild.config.js
import { build } from "esbuild";
import graph from "@monstermann/unplugin-graph/esbuild";

build({
    plugins: [graph()],
});
```

## Graph

### batch

```ts
function Graph.batch(
    graph: Graph,
    transform: (graph: Graph) => Graph | void,
): Graph
```

Performs multiple graph mutations efficiently by batching them together. Returns the original graph if no changes were made, optimizing for structural sharing.

#### Example

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

### create

```ts
function Graph.create<Nodes, Edges>(): Graph<Nodes, Edges>
```

Creates a new empty graph with the provided nodes & edges configuration.

#### Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    // Project <-> Task
    Project: { Task: void };
    // Section <-> Task
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
```

### findEdge

```ts
function Graph.findEdge(
    graph: Graph,
    source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    type: NodeType,
    find: (edge: EdgeData) => boolean,
): EdgeData | undefined
```

Finds the first edge of a specific type from a source node that matches the predicate. Returns `undefined` if no matching edge is found.

#### Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    Project: { Task: { priority: number; assignedAt: Date } };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
let g = Graph.setNode(graph, { type: "Project", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "2" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], {
    priority: 1,
    assignedAt: new Date(),
});
g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"], {
    priority: 2,
    assignedAt: new Date(),
});

const highPriorityEdge = Graph.findEdge(
    g,
    ["Project", "1"],
    "Task",
    (edge) => edge.priority > 1,
);
// highPriorityEdge: { priority: 2, assignedAt: Date }
```

### findEdges

```ts
function Graph.findEdges(
    graph: Graph,
    source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    type: NodeType,
    find: (edge: EdgeData) => boolean,
): EdgeData[]
```

Finds all edges of a specific type from a source node that match the predicate.

#### Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    Project: { Task: { priority: number; assignedAt: Date } };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
let g = Graph.setNode(graph, { type: "Project", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "2" });
g = Graph.setNode(g, { type: "Task", id: "3" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], {
    priority: 1,
    assignedAt: new Date(),
});
g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"], {
    priority: 2,
    assignedAt: new Date(),
});
g = Graph.setEdge(g, ["Project", "1"], ["Task", "3"], {
    priority: 3,
    assignedAt: new Date(),
});

const highPriorityEdges = Graph.findEdges(
    g,
    ["Project", "1"],
    "Task",
    (edge) => edge.priority >= 2,
);
// highPriorityEdges: [{ priority: 2, ... }, { priority: 3, ... }]
```

### findNeighbor

```ts
function Graph.findNeighbor(
    graph: Graph,
    node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    type: NodeType,
    find: (target: Node, edge: EdgeData, source: Node) => boolean,
): Node | undefined
```

Finds the first neighbor node of a specific type that matches the predicate. The predicate receives the target node, edge data, and source node. Returns `undefined` if no matching neighbor is found.

#### Example

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

### findNeighbors

```ts
function Graph.findNeighbors(
    graph: Graph,
    node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    type: NodeType,
    find: (target: Node, edge: EdgeData, source: Node) => boolean,
): Node[]
```

Finds all neighbor nodes of a specific type that match the predicate. The predicate receives the target node, edge data, and source node.

#### Example

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

### findNode

```ts
function Graph.findNode(
    graph: Graph,
    type: NodeType,
    find: (node: Node) => boolean,
): Node | undefined
```

Finds the first node of a specific type that matches the predicate. Returns `undefined` if no matching node is found.

#### Example

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

### findNodes

```ts
function Graph.findNodes(
    graph: Graph,
    type: NodeType,
    find: (node: Node) => boolean,
): Node[]
```

Finds all nodes of a specific type that match the predicate.

#### Example

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

### forEachEdge

```ts
function Graph.forEachEdge(
    graph: Graph,
    source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    type: NodeType,
    fn: (edge: EdgeData) => void,
): Graph
```

Iterates over all edges of a specific type from a source node, executing a function for each edge. Returns the graph unchanged (for chaining).

#### Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    Project: { Task: { priority: number } };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
let g = Graph.setNode(graph, { type: "Project", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "2" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], { priority: 1 });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"], { priority: 2 });

Graph.forEachEdge(g, ["Project", "1"], "Task", (edge) => {
    console.log(edge.priority);
});
// Logs:
// 1
// 2
```

### forEachNeighbor

```ts
function Graph.forEachNeighbor(
    graph: Graph,
    node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    type: NodeType,
    fn: (target: Node, edge: EdgeData, source: Node) => void,
): Graph
```

Iterates over all neighbor nodes of a specific type, executing a function for each neighbor. The function receives the target node, edge data, and source node. Returns the graph unchanged (for chaining).

#### Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string; title: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string; name: string };

type Edges = {
    Project: { Task: { priority: number } };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
let g = Graph.setNode(graph, { type: "Project", id: "1", name: "My Project" });
g = Graph.setNode(g, { type: "Task", id: "1", title: "First Task" });
g = Graph.setNode(g, { type: "Task", id: "2", title: "Second Task" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], { priority: 1 });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"], { priority: 2 });

Graph.forEachNeighbor(g, ["Project", "1"], "Task", (task, edge, project) => {
    console.log(`${project.name}: ${task.title} (priority: ${edge.priority})`);
});
// Logs:
// "My Project: First Task (priority: 1)"
// "My Project: Second Task (priority: 2)"
```

### forEachNode

```ts
function Graph.forEachNode(
    graph: Graph,
    type: NodeType,
    fn: (node: Node) => void,
): Graph
```

Iterates over all nodes of a specific type, executing a function for each node. Returns the graph unchanged (for chaining).

#### Example

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
let g = Graph.setNode(graph, { type: "Task", id: "1", title: "First Task" });
g = Graph.setNode(g, { type: "Task", id: "2", title: "Second Task" });
g = Graph.setNode(g, { type: "Task", id: "3", title: "Third Task" });

Graph.forEachNode(g, "Task", (task) => {
    console.log(task.title);
});
// Logs:
// "First Task"
// "Second Task"
// "Third Task"
```

### fromJS

```ts
function Graph.fromJS(data: {
    nodes: Node[];
    edges: [NodeType, NodeId, NodeType, NodeId, EdgeData][];
}): Graph
```

Creates a graph from a plain JavaScript object representation. Useful for deserializing graphs from JSON or other storage formats.

#### Example

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

const data = {
    nodes: [
        { type: "Project", id: "1" },
        { type: "Task", id: "1", title: "My Task" },
        { type: "Task", id: "2", title: "Another Task" },
    ],
    edges: [
        ["Project", "1", "Task", "1", undefined],
        ["Project", "1", "Task", "2", undefined],
    ],
};

const graph = Graph.fromJS<Nodes, Edges>(data);

Graph.hasNode(graph, ["Project", "1"]); // true
Graph.hasEdge(graph, ["Project", "1"], ["Task", "1"]); // true
```

### getEdge

```ts
function Graph.getEdge(
    graph: Graph,
    source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    target: [NodeType, NodeId] | { type: NodeType, id: NodeId },
): EdgeData | undefined
```

Retrieves the edge data between two nodes. Returns `undefined` if the edge doesn't exist.

#### Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    Project: { Task: { assignedAt: Date } };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
let g = Graph.setNode(graph, { type: "Project", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "1" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], {
    assignedAt: new Date(),
});

const edge = Graph.getEdge(g, ["Project", "1"], ["Task", "1"]);
// edge: { assignedAt: Date }

const missing = Graph.getEdge(g, ["Project", "1"], ["Task", "2"]);
// missing: undefined
```

### getEdges

```ts
function Graph.getEdges(
    graph: Graph,
    source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    type: NodeType,
): EdgeData[]
```

Retrieves all edges of a specific type from a source node.

#### Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    Project: { Task: { priority: number } };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
let g = Graph.setNode(graph, { type: "Project", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "2" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], { priority: 1 });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"], { priority: 2 });

const edges = Graph.getEdges(g, ["Project", "1"], "Task");
// edges: [{ priority: 1 }, { priority: 2 }]
```

### getNeighbor

```ts
function Graph.getNeighbor(
    graph: Graph,
    node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    type: NodeType,
): Node | undefined
```

Retrieves the first neighbor node of a specific type connected to the source node. Returns `undefined` if no neighbor of the specified type exists.

#### Example

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
g = Graph.setNode(g, { type: "Task", id: "1", title: "Task 1" });
g = Graph.setNode(g, { type: "Task", id: "2", title: "Task 2" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"]);
g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"]);

const firstTask = Graph.getNeighbor(g, ["Project", "1"], "Task");
// firstTask: { type: "Task", id: "1", title: "Task 1" }

const noSection = Graph.getNeighbor(g, ["Project", "1"], "Section");
// noSection: undefined
```

### getNeighbors

```ts
function Graph.getNeighbors(
    graph: Graph,
    node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    type: NodeType,
): Node[]
```

Retrieves all neighbor nodes of a specific type connected to the source node.

#### Example

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
g = Graph.setNode(g, { type: "Task", id: "1", title: "Task 1" });
g = Graph.setNode(g, { type: "Task", id: "2", title: "Task 2" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"]);
g = Graph.setEdge(g, ["Project", "1"], ["Task", "2"]);

const tasks = Graph.getNeighbors(g, ["Project", "1"], "Task");
// tasks: [{ type: "Task", id: "1", title: "Task 1" }, { type: "Task", id: "2", title: "Task 2" }]
```

### getNode

```ts
function Graph.getNode(
    graph: Graph,
    node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
): Node | undefined
```

Retrieves a node from the graph. Returns `undefined` if the node doesn't exist.

#### Example

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
const withNode = Graph.setNode(graph, {
    type: "Task",
    id: "1",
    title: "My Task",
});

const task = Graph.getNode(withNode, ["Task", "1"]);
// task: { type: "Task", id: "1", title: "My Task" }

const missing = Graph.getNode(withNode, ["Task", "2"]);
// missing: undefined
```

### getNodes

```ts
function Graph.getNodes(
    graph: Graph,
    type: NodeType,
): Node[]
```

Retrieves all nodes of a specific type from the graph.

#### Example

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

### hasEdge

```ts
function Graph.hasEdge(
    graph: Graph,
    source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    target: [NodeType, NodeId] | { type: NodeType, id: NodeId },
): boolean
```

Checks if an edge exists between two nodes in the graph.

#### Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    Project: { Task: void };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
let g = Graph.setNode(graph, { type: "Project", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "1" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"]);

Graph.hasEdge(g, ["Project", "1"], ["Task", "1"]); // true
Graph.hasEdge(g, ["Task", "1"], ["Project", "1"]); // true (bidirectional)
Graph.hasEdge(g, ["Project", "1"], ["Task", "2"]); // false
```

### hasNode

```ts
function Graph.hasNode(
    graph: Graph,
    node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
): boolean
```

Checks if a node exists in the graph.

#### Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    Project: { Task: void };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
const withNode = Graph.setNode(graph, { type: "Task", id: "1" });

Graph.hasNode(withNode, ["Task", "1"]); // true
Graph.hasNode(withNode, { type: "Task", id: "1" }); // true
Graph.hasNode(withNode, ["Task", "2"]); // false
```

### mapEdge

```ts
function Graph.mapEdge(
    graph: Graph,
    source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    target: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    update: (edge: EdgeData) => EdgeData,
): Graph
```

Updates an edge by applying a transformation function. Returns a new graph instance with the updated edge.

#### Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    Project: { Task: { priority: number; assignedAt: Date } };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
let g = Graph.setNode(graph, { type: "Project", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "1" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], {
    priority: 1,
    assignedAt: new Date(),
});

// Update edge data
g = Graph.mapEdge(g, ["Project", "1"], ["Task", "1"], (edge) => ({
    ...edge,
    priority: 2,
}));
```

### mapNode

```ts
function Graph.mapNode(
    graph: Graph,
    node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    update: (node: Node) => Node,
): Graph
```

Updates a node by applying a transformation function. If the node's type or id changes, all edges are preserved. Returns a new graph instance with the updated node.

#### Example

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

### mergeEdge

```ts
function Graph.mergeEdge(
    graph: Graph,
    source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    target: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    update: Partial<EdgeData>,
): Graph
```

Partially updates an edge by merging the provided properties. Returns a new graph instance with the updated edge.

#### Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    Project: { Task: { priority: number; assignedAt: Date } };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
let g = Graph.setNode(graph, { type: "Project", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "1" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], {
    priority: 1,
    assignedAt: new Date(),
});

// Merge partial update
g = Graph.mergeEdge(g, ["Project", "1"], ["Task", "1"], { priority: 2 });

const edge = Graph.getEdge(g, ["Project", "1"], ["Task", "1"]);
// edge: { priority: 2, assignedAt: <original date> }
```

### mergeNode

```ts
function Graph.mergeNode(
    graph: Graph,
    node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    update: Partial<Node>,
): Graph
```

Partially updates a node by merging the provided properties. Returns a new graph instance with the updated node.

#### Example

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

### removeEdge

```ts
function Graph.removeEdge(
    graph: Graph,
    source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    target: [NodeType, NodeId] | { type: NodeType, id: NodeId },
): Graph
```

Removes an edge between two nodes. The nodes remain in the graph. Returns a new graph instance without the edge.

#### Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    Project: { Task: void };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
let g = Graph.setNode(graph, { type: "Project", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "1" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"]);

// Remove the edge
g = Graph.removeEdge(g, ["Project", "1"], ["Task", "1"]);

Graph.hasNode(g, ["Project", "1"]); // true
Graph.hasNode(g, ["Task", "1"]); // true
Graph.hasEdge(g, ["Project", "1"], ["Task", "1"]); // false
```

### removeNode

```ts
function Graph.removeNode(
    graph: Graph,
    node: [NodeType, NodeId] | { type: NodeType, id: NodeId },
): Graph
```

Removes a node and all its associated edges from the graph. Returns a new graph instance without the node.

#### Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    Project: { Task: void };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
let g = Graph.setNode(graph, { type: "Project", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "1" });
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"]);

// Remove the task (also removes the edge)
g = Graph.removeNode(g, ["Task", "1"]);

Graph.hasNode(g, ["Task", "1"]); // false
Graph.hasEdge(g, ["Project", "1"], ["Task", "1"]); // false
```

### setEdge

```ts
function Graph.setEdge(
    graph: Graph,
    source: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    target: [NodeType, NodeId] | { type: NodeType, id: NodeId },
    data?: EdgeData,
): Graph
```

Adds or updates an edge between two nodes. Both nodes must exist in the graph. Returns a new graph instance with the edge set. Edges are bidirectional.

#### Example

```ts
import { Graph } from "@monstermann/graph";

type Nodes =
    | { type: "Task"; id: string }
    | { type: "Section"; id: string }
    | { type: "Project"; id: string };

type Edges = {
    Project: { Task: { assignedAt: Date } };
    Section: { Task: void };
};

const graph = Graph.create<Nodes, Edges>();
let g = Graph.setNode(graph, { type: "Project", id: "1" });
g = Graph.setNode(g, { type: "Task", id: "1" });

// Add edge with data
g = Graph.setEdge(g, ["Project", "1"], ["Task", "1"], {
    assignedAt: new Date(),
});

// Add edge without data (void)
let g2 = Graph.setNode(graph, { type: "Section", id: "1" });
g2 = Graph.setNode(g2, { type: "Task", id: "1" });
g2 = Graph.setEdge(g2, ["Section", "1"], ["Task", "1"]);
```

### setNode

```ts
function Graph.setNode(
    graph: Graph,
    node: Node,
): Graph
```

Adds or updates a node in the graph. Returns a new graph instance with the node set.

#### Example

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

// Add a new node
const g1 = Graph.setNode(graph, { type: "Task", id: "1", title: "My Task" });

// Update existing node
const g2 = Graph.setNode(g1, { type: "Task", id: "1", title: "Updated Task" });
```

### toJS

```ts
function Graph.toJS(
    graph: Graph,
): {
    nodes: Node[];
    edges: [NodeType, NodeId, NodeType, NodeId, EdgeData][];
}
```

Converts a graph to a plain JavaScript object representation. Useful for serializing graphs to JSON or other storage formats.

#### Example

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
