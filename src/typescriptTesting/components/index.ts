import { MyExampleComponent } from './MyExampleComponent'
import { AnyComponentProps } from '../parser'
export const ComponentProps = <T extends AnyComponentProps>(props: T): T => props

export const Components = {
    MyExampleComponent
}