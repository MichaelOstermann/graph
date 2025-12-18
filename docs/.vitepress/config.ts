import { defineConfig } from "vitepress"
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons"

export default defineConfig({
    base: "/graph/",
    description: "Functional graph data-structure.",
    title: "graph",
    markdown: {
        theme: {
            dark: "catppuccin-macchiato",
            light: "github-light-default",
        },
        config(md) {
            md.use(groupIconMdPlugin)
        },
    },
    themeConfig: {
        aside: false,
        outline: "deep",
        docFooter: {
            next: false,
            prev: false,
        },
        search: {
            provider: "local",
        },
        sidebar: [
            { base: "/Graph/", text: "Graph", items: [
                { link: "batch", text: "batch" },
                { link: "create", text: "create" },
                { link: "findEdge", text: "findEdge" },
                { link: "findEdges", text: "findEdges" },
                { link: "findNeighbor", text: "findNeighbor" },
                { link: "findNeighbors", text: "findNeighbors" },
                { link: "findNode", text: "findNode" },
                { link: "findNodes", text: "findNodes" },
                { link: "forEachEdge", text: "forEachEdge" },
                { link: "forEachNeighbor", text: "forEachNeighbor" },
                { link: "forEachNode", text: "forEachNode" },
                { link: "fromJS", text: "fromJS" },
                { link: "getEdge", text: "getEdge" },
                { link: "getEdges", text: "getEdges" },
                { link: "getNeighbor", text: "getNeighbor" },
                { link: "getNeighbors", text: "getNeighbors" },
                { link: "getNode", text: "getNode" },
                { link: "getNodes", text: "getNodes" },
                { link: "hasEdge", text: "hasEdge" },
                { link: "hasNode", text: "hasNode" },
                { link: "mapEdge", text: "mapEdge" },
                { link: "mapNode", text: "mapNode" },
                { link: "mergeEdge", text: "mergeEdge" },
                { link: "mergeNode", text: "mergeNode" },
                { link: "removeEdge", text: "removeEdge" },
                { link: "removeNode", text: "removeNode" },
                { link: "setEdge", text: "setEdge" },
                { link: "setNode", text: "setNode" },
                { link: "toJS", text: "toJS" },
            ] },
        ],
        socialLinks: [
            { icon: "github", link: "https://github.com/MichaelOstermann/graph" },
        ],
    },
    vite: {
        plugins: [
            groupIconVitePlugin(),
        ],
    },
})
