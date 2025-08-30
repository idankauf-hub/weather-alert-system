export const PARAMS = ["temperature", "windSpeed", "precipitation"] as const;
export const OPS = ["gt", "gte", "lt", "lte", "eq"] as const;

export type Parameter = (typeof PARAMS)[number];
export type Operator = (typeof OPS)[number];

export const OPS_MAP: { value: Operator; label: string }[] = [
  { value: "gt", label: ">" },
  { value: "gte", label: "≥" },
  { value: "lt", label: "<" },
  { value: "lte", label: "≤" },
  { value: "eq", label: "=" },
];
