type ValueOf<T> = T[keyof T];

export const enumToValues = <T extends Object>(enumVariable: T): ReadonlyArray<ValueOf<T>> => {
    return Object.keys(enumVariable).map((key) => enumVariable[key])
}
export const EnumPropertyParser = <T extends ReadonlyArray<any>>(options: {
    allowedValues: T
}) => (propValue: unknown): typeof options.allowedValues[number] => {
    return options.allowedValues[0]
}
