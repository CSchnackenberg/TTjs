import { AbstractComponent } from './AbstractComponent'
import { ComponentProps } from './index'
import { NumberPropertyParser } from '../parser/NumberPropertyParser'
import { EnumPropertyParser } from '../parser/EnumPropertyParser'
import { ConvertComponentProps } from '../parser'


const MyExampleComponentProps = ComponentProps({
    width: NumberPropertyParser({min: 10, max: 200}),
    height: NumberPropertyParser(),
    more: NumberPropertyParser({
        validate: (i) => i % 2 === 0
    }),
    type: EnumPropertyParser({
        allowedValues: <const>['test', 'abcd']
    })
})

type MyExampleComponentPropsType = ConvertComponentProps<typeof MyExampleComponentProps>

export class MyExampleComponent extends AbstractComponent<MyExampleComponentPropsType> {
    onInit(props: MyExampleComponentPropsType) {

    }
}