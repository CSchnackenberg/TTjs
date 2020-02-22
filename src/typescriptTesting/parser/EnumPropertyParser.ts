
export const EnumPropertyParser = (propValue: unknown, options: {
    allowedValues: readonly string[]
}): string => {
    return options.allowedValues[0]
}
