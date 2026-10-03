import { defineConfig, flat, namespace } from "@monstermann/barrels"

export default defineConfig([
    namespace({
        entries: "./packages/graph/src/Graph",
    }),
    flat({
        entries: "./packages/graph/src",
        include: ["Graph/index.js"],
    }),
])
