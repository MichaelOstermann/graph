# create

```ts
function Graph.create<Nodes, Edges>(): Graph<Nodes, Edges>
```

Creates a new empty graph with the provided nodes & edges configuration.

## Example

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
