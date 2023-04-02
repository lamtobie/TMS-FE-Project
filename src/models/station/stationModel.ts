export interface StationModel {
    stt:number,
    code: string,
    name: string,
    contactPerson: string,
    contactEmail: string,
    contactPhone: string,
    address?: string,
    lat?: number,
    long?: number,
    status: string,
    createdAt: number,
    [key: string]: any
}