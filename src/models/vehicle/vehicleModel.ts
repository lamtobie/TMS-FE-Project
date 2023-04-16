import { InitCategoryPageState } from '../commons/initStateModel';
import { TrackableModel } from '../commons/trackableModel';
import { VehicleTypeModel } from './vehicleTypeModel';

export interface InitVehiclePageState extends InitCategoryPageState<VehicleModel> { }

export interface VehicleModel extends TrackableModel {
    stt?:number,
    code?: string,
    vehicleTypeCode?: string,
    vehicleTypeInformation?:VehicleTypeModel;
    numberPlate?: string,
    status?: string,
    createAt?: string,
}


