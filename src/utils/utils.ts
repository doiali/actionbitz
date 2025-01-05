export const parseDateSafe = (x?: string | null | undefined) => (
  x ? new Date(x) : null
) 