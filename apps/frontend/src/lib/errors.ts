export function getErrMsg(e: any): string {
  const message =
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.response?.statusText;
  if (message) return String(message);

  if (e?.message) return String(e.message);

  if (Array.isArray(e)) return e.join(", ");
  if (typeof e === "string") return e;

  return "Something went wrong";
}
