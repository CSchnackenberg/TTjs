import { NumberPropertyParser } from './NumberPropertyParser'
import { EnumPropertyParser } from './EnumPropertyParser'

export const Parsers = {
    number: NumberPropertyParser,
    enum: EnumPropertyParser
}
export type ParsersType = typeof Parsers

export type Parser<T extends keyof ParsersType> = [T, Parameters<ParsersType[T]>[1]?]

export type AnyComponentProps = Record<string, Parser<keyof ParsersType>>

export type ConvertComponentProps<T extends AnyComponentProps> = {[K in keyof T]: ReturnType<ParsersType[T[K][0]]>}
