import { AddressModel } from "models/address/addressModel";

export interface StationModel {
    stt?:number,
    code?: string,
    name?: string,
    contactPerson?: string,
    contactEmail?: string,
    contactPhone?: string,
    contactPersonAnother?:string,
    contactEmailAnother?:string,
    contactPhoneAnother?:string,
    address?: AddressModel,
    status?: string,
    createdAt?: number,
    [key: string]: any
}