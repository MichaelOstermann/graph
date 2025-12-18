---
aside: true
---

# graph

<Badge type="info" class="size">
    <span>Minified</span>
    <span>5.21 KB</span>
</Badge>

<Badge type="info" class="size">
    <span>Minzipped</span>
    <span>1.54 KB</span>
</Badge>

**Functional graph data-structure.**

This library implements a graph data-structure that is undirected, simple, heterogeneous, attributed and cyclical.

These graphs are immutable with efficient update procedures, including batched updates featuring transient mutations.

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

::: code-group

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

:::

## Tree-shaking

### Installation

::: code-group

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

:::

### Usage

::: code-group

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

:::
