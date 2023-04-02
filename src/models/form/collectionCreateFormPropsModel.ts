export interface CollectionCreateFormPropsModel<T> {
    open: boolean;
    onCreate?: (values: any) => void;
    onCancel?: () => void;
}