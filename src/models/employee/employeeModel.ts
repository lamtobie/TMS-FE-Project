import { InitCategoryPageState } from '../commons/initStateModel';
import { TrackableModel } from '../commons/trackableModel';

export interface InitEmployeePageState extends InitCategoryPageState<EmployeeModel> {}

export type EmployeeType = 'Driver' | 'Coordinator'

export interface EmployeeModel extends TrackableModel {
    code: string,
    employeeType: string,
    fullName: string,
    mobilePhone: string,
    email?: string,
    identityNumber?: string,
    address?: string,
    threePLTeam?: string,
    status: string,
    password?: string,
    avatarPicture?: string,
    identityNumberPicture?: string,
    drivingLicensePicture?: string,
    [key: string]: any
}