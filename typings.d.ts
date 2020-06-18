declare module 'moving-averages' {
  export const ma: (arr: number[], count: number) => number[]
}

declare module 'simplify-geometry' {
  type GeoJSON = [number, number]
  let simplify: (_arr: GeoJSON[], _tolerance: number) => GeoJSON[]
  export = simplify
}
