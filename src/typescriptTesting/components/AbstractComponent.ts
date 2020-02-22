import { AnyComponentProps } from '../parser'

export abstract class AbstractComponent<T_Props> {
    public abstract onInit(props: T_Props)
}