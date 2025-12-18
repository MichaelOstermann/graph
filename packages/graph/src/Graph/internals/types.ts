type GetAllTargets<E> = E extends Record<string, infer V>
    ? V extends Record<string, any>
        ? keyof V
        : never
    : never

type GetReverseMappings<E, Target> = {
    [K in keyof E as Target extends keyof E[K] ? K : never]: E[K][Target & keyof E[K]]
}

export type Bimap<E> = {
    [K in keyof E | GetAllTargets<E>]:
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    (K extends keyof E ? E[K] : {})
    & GetReverseMappings<E, K>
}
