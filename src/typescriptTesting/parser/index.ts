export type AnyComponentProps = Record<string, (prop: unknown) => unknown>

export type ConvertComponentProps<T extends AnyComponentProps> = {[K in keyof T]: ReturnType<T[K]>}
