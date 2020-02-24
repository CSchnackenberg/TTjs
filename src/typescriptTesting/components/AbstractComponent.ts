export abstract class AbstractComponent<T_Props> {
    public abstract onInit(props: T_Props)

    children: <T_Props>(props: T_Props) => {}
    res: <T_Props>(props: T_Props) => {}
}
export interface Component<T_Component, T_Props> {
    new(): T_Component
    res: (props: T_Props) => {
    }
    children: (props: T_Props) => {
    }
}