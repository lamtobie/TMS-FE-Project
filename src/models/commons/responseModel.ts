export interface ListResponseModel<T> {
    success?: boolean;
    r_code?: string;
    r_message?: string;
    data?: {
        items?: T[],
        current_page?: number;
        total_count?: number;
        total_pages?: number;
        items_per_page?: number;
        [key: string]: any;
    },
    [key: string]: any;
}

export interface DataResponseModel<T> {
    success?: boolean;
    r_code?: string;
    r_message?: string;
    data?: T;
}

