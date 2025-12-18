import { defineConfig } from "@monstermann/barrels"
import { flat } from "@monstermann/barrels-flat"
import { namespace } from "@monstermann/barrels-namespace"

export default defineConfig([
    namespace({
        entries: "./packages/graph/src/Graph",
    }),
    flat({
        entries: "./packages/graph/src",
        include: ["*", "Graph/index.js"],
    }),
])
