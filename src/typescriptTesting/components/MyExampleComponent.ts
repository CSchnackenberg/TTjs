import { AbstractComponent, Component } from './AbstractComponent'
import { ComponentProps } from './index'
import { NumberPropertyParser } from '../parser/NumberPropertyParser'
import { EnumPropertyParser } from '../parser/EnumPropertyParser'
import { ConvertComponentProps } from '../parser'

enum AllowedTypes {
    test = 'test',
    abcd = 'abcd'
}

const MyExampleComponentProps = ComponentProps({
    width: NumberPropertyParser({min: 10, max: 200}),
    height: NumberPropertyParser(),
    more: NumberPropertyParser({
        validate: (i) => i % 2 === 0
    }),
    type: EnumPropertyParser({
        allowedValues: Object.keys(AllowedTypes) as ReadonlyArray<keyof typeof AllowedTypes>
    })
})

type MyExampleComponentPropsType = ConvertComponentProps<typeof MyExampleComponentProps>
class MyExampleComponentClass extends AbstractComponent<MyExampleComponentPropsType> {
    public constructor() {
        super()
    }
    onInit(props: MyExampleComponentPropsType) {
    }
    static res: () => {

    }
    static children: () => {

    }
}

export const MyExampleComponent: Component<MyExampleComponentClass, MyExampleComponentPropsType> = MyExampleComponentClass
