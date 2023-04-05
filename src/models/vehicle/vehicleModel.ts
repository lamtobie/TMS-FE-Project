import { InitCategoryPageState } from '../commons/initStateModel';
import { TrackableModel } from '../commons/trackableModel';
import { VehicleType } from './vehicleTypeModel';

export interface InitVehiclePageState extends InitCategoryPageState<VehicleModel> { }

export interface VehicleModel extends TrackableModel {
    code: string,
    vehicleTypeCode: string,
    numberPlate: string,
    status?: string,
    createDate?: string,
}

export interface ViewVehicleModel extends TrackableModel {
    stt: number,
    code: string,
    vehicleInfo:VehicleType,
    numberPlate: string,
    status?: string,
    createDate?: string,
}
