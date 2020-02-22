export interface NumberPropertyParserOptions {
    max?: number
    min?: number
    validate?: (parsedValue: number) => boolean
}

export const NumberPropertyParser = (options: NumberPropertyParserOptions = {}) => (propValue: unknown) => {
    // we only accept numbers here
    const parsedValue = Number(propValue)
    if (isNaN(parsedValue))
        throw "Value is not a number"

    // check minvalue
    if (options.min !== undefined) {
        if (parsedValue < options.min)
            throw `Required value is to small. Minimum is ${options.min}. Provided: "${parsedValue}"`
    }

    // check maxvalue
    if (options.max !== undefined) {
        if (parsedValue > options.max)
            throw `Required value is to big. Maximum is ${options.max}. Provided: "${parsedValue}`
    }

    // user validate
    if (options.validate) {
        try {

            if (!options.validate(parsedValue)) {
                throw "Validation failed"
            }
        } catch (e) {
            throw `Validation failed with message "${e}"`
        }
    }
    return parsedValue
}
