import { AddressModel } from 'models/address/addressModel';
import { InitCategoryPageState } from '../commons/initStateModel';
import { TrackableModel } from '../commons/trackableModel';
import { StationModel } from 'models/station/stationModel';

export interface InitEmployeePageState extends InitCategoryPageState<EmployeeModel> {}

export type EmployeeType = 'Driver' | 'Coordinator'

export interface EmployeeModel extends TrackableModel {
    stt?:number,
    code?: string,
    employeeType?:string,
    fullName?:string,
    mobilePhone?:string,
    stationCode?:string,
    isStationAdmin?:boolean,
    identityNumber?:string
    email?:string,
    password?:string,
    addressId?:string,
    threePLTeam?:string,
    avatarPicture?:string,
    drivingLicensePicture?:string,
    identityNumberPicture?:string,
    status?:string,
    services?:string
    address?:AddressModel,
    station?:StationModel,
}