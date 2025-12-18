import type { FilterPattern } from "unplugin"

export interface Options {
    debug?: boolean | FilterPattern
    enforce?: "post" | "pre" | undefined
    exclude?: FilterPattern
    include?: FilterPattern
}
