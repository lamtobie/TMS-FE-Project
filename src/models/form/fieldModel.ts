import { InputHTMLAttributes } from 'react'

export interface FieldProps<T> {
    [key: string]: InputHTMLAttributes<T>
}

export interface SelectOptionModel {
    key?: string
    label: string,
    value: any,
    [key: string]: any
}