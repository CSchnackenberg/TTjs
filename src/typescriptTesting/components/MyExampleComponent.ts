import { AbstractComponent } from './AbstractComponent'
import { ConvertComponentProps } from '../parser'
import { ComponentProps } from './index'


const MyExampleComponentProps = ComponentProps({
    width: ['number', {min: 10, max: 200}],
    height: ['number'],
    more: ['number', {
        validate: (i) => i % 2 === 0
    }],
    type: ['enum', {
        allowedValues: <const>['test', 'abcd']
    }]
})

type MyExampleComponentPropsType = ConvertComponentProps<typeof MyExampleComponentProps>

export class MyExampleComponent extends AbstractComponent<MyExampleComponentPropsType> {
    onInit(props: MyExampleComponentPropsType) {

    }
}