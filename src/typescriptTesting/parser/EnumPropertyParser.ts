
export const EnumPropertyParser = <T extends ReadonlyArray<string>>(options: {
    allowedValues: T
}) => (propValue: unknown): typeof options.allowedValues[number] => {
    return options.allowedValues[0]
}
