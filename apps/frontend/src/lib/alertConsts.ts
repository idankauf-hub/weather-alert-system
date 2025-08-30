export const PARAMS = ["temperature", "windSpeed", "precipitation"] as const;
export const OPS = ["gt", "gte", "lt", "lte", "eq"] as const;

export type Parameter = (typeof PARAMS)[number];
export type Operator = (typeof OPS)[number];
