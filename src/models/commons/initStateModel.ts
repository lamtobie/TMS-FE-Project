export interface InitStateModel<T> {
    [key: string]: any
}

export interface InitCategoryPageState<T> extends InitStateModel<T> {
    items?: T[],
    total_count?: number,
    filter?: T[],
    detail?: T,
    loading: boolean
}