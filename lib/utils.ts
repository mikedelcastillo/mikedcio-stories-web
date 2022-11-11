export type CastMap = {
    string: string,
    number: number,
    boolean: boolean,
}

export function unwrapOrDefault<K extends keyof CastMap>(type: K, val: unknown): CastMap[K] {
    type O = CastMap[K]

    if(typeof val === type) return val as O

    if(type === "string"){
        if(typeof val === "undefined" || val === null) return "" as O
        return String(val) as O
    }

    if(type === "number"){
        if(typeof val === "undefined" || val === null) return 0 as O
        return Number(val) as O
    }

    if(type === "boolean"){
        if(typeof val === "undefined" || val === null) return false as O
        if(typeof val === "string") return (val === "true") as O
        if(typeof val === "number") return (val !== 0) as O
    }

    return val as O
}

export function unwrapOr<T, K extends keyof CastMap>(type: K, val: unknown, def: T): CastMap[K] | T {
    if(typeof val === "undefined" || val === null) return def
    const casted = unwrapOrDefault(type, val)

    if(typeof casted === "string" && casted.length === 0) return def
    if(typeof casted === "number" && (casted === 0 || isNaN(casted))) return def
    if(typeof casted === "boolean" && casted === false) return def

    return casted
}