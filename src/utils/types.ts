export type SerializedDate<T> = {
  [K in keyof T]: NonNullable<T[K]> extends Date ? string | Exclude<T[K], Date> : T[K]
}

export type SerializedBigint<T> = {
  [K in keyof T]: NonNullable<T[K]> extends bigint ? number | Exclude<T[K], bigint> : T[K]
}

export type SerializedModel<T> = SerializedBigint<SerializedDate<T>>